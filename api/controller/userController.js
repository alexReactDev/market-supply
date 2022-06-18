const db = require("../db");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
class UserController {
	async getUser(req, res) {
		const userId = req.params.userId;

		let user;

		try {
			user = (await db.query("SELECT * FROM users where id = $1;", [userId])).rows[0];
		}
		catch(e) {
			return res.sendStatus(500)
		}

		if(!user) return res.sendStatus(404);

		res.send(user);
	}

	async createUser(req, res) {
		const {payload} = req.body;
		const userId = uuid.v4();

		let createdUser;

		let userPersonId;

		try {
			createdUser = (await db.query("INSERT INTO users (id, name, surname, email, phone, town, street, house, apartment, zip) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;",
			[userId, payload.name, payload.surname, payload.email, payload.phone, payload.town, payload.street, payload.house, payload.apartment, payload.zip])).rows[0];

			userPersonId = (await db.query("INSERT INTO persons (user_id) values($1) RETURNING id;", [createdUser.id])).rows[0].id;
		}
		catch(e) {
			console.log(e);
			return res.sendStatus(500);
		}

		try {
			const hashPassword = await bcrypt.hash(payload.password, +process.env.BCRYPT_SALT_ROUNDS);
		
			await(db.query("INSERT INTO users_passwords (user_id, password) values($1, $2);", [createdUser.id, hashPassword]));	
		}
		catch(e) {
			console.log(e);
			return res.sendStatus(500);
		}

		const tokenData = {
			authorized: true,
			userId: createdUser.id,
			personId: userPersonId
		}

		const token = jwt.sign({data: tokenData}, process.env.JWT_SECRET, {expiresIn: process.env.SESSION_EXPIRES_IN / 1000});

		res.cookie("jwt", token);

		res.status(201).send(createdUser);
	}

	async changeUserProfile(req, res) {
		const userId = req.params.userId;
		const {password, payload} = req.body;

		if(req.tokenData.userId !== userId) res.sendStatus(403);
		
		let user;

		try {
			user = (await db.query("SELECT * FROM users where id = $1;", [userId])).rows[0];
			if(!user) return res.sendStatus(400);
		}
		catch(e) {
			return res.sendStatus(500);
		}	

		try {
			const hashPassword = (await db.query("SELECT password FROM users_passwords where user_id = $1;", [user.id])).rows[0].password;

			const isCorrect = await bcrypt.compare(password, hashPassword);
			
			if(!isCorrect) return res.sendStatus(403);
		}
		catch(e) {
			console.log(e);
			return res.sendStatus(500);
		}

		let updatedProfile;

		try {
			updatedProfile = (await db.query("UPDATE users SET (name, surname, phone, town, street, house, apartment, zip) = ($1, $2, $3, $4, $5, $6, $7, $8) where id = $9 RETURNING *;", 
			[payload.name, payload.surname, payload.phone, payload.town, payload.street, payload.house, payload.apartment, payload.zip, user.id])).rows[0];
		}
		catch(e) {
			return res.sendStatus(500);
		}

		res.send(updatedProfile);
	}

	async changeUserEmail(req, res) {
		const userId = req.params.userId;
		const {password, payload} = req.body;

		if(req.tokenData.userId !== userId) res.sendStatus(403);
		
		let user;

		try {
			user = (await db.query("SELECT * FROM users where id = $1;", [userId])).rows[0];
			if(!user) return res.sendStatus(400);
		}
		catch(e) {
			res.sendStatus(500);
		}

		try {
			const hashPassword = (await db.query("SELECT password FROM users_passwords where user_id = $1;", [user.id])).rows[0].password;

			const isCorrect = await bcrypt.compare(password, hashPassword);
			
			if(!isCorrect) return res.sendStatus(403);
		}
		catch(e) {
			return res.sendStatus(500);
		}

		let updatedEmail;

		try {
			updatedEmail = (await db.query("UPDATE users SET email = $1 where id = $2 RETURNING email;", [payload, user.id])).rows[0].email;
		}
		catch(e) {
			return res.sendStatus(500);
		}

		res.send(updatedEmail);
	}

	async changeUserPassword(req, res) {
		const userId = req.params.userId;
		const {password, payload} = req.body;

		if(req.tokenData.userId !== userId) return res.sendStatus(403);

		let user; 

		try {
			user = (await db.query("SELECT * FROM users where id = $1;", [userId])).rows[0];
			if(!user) return res.sendStatus(400);
		}
		catch(e) {
			console.log(e);
			return res.sendStatus(500);
		}

		try {
			const hashPassword = (await db.query("SELECT password FROM users_passwords where user_id = $1;", [user.id])).rows[0].password;

			const isCorrect = await bcrypt.compare(password, hashPassword);
			
			if(!isCorrect) return res.sendStatus(403);
		}
		catch(e) {
			console.log(e);
			return res.sendStatus(500);
		}

		try {
			const newHashPassword = await bcrypt.hash(payload, +process.env.BCRYPT_SALT_ROUNDS);

			await db.query("UPDATE users_passwords SET password = $1 where user_id = $2 RETURNING password;", [newHashPassword, user.id]);
		}
		catch(e) {
			return res.sendStatus(500);
		}

		res.cookie("jwt", "", {maxAge: 0});
		
		res.sendStatus(200);
	}

	async deleteUser(req, res) {
		const userId = req.params.userId;
		const {password} = req.body;

		if(req.tokenData.userId !== userId) res.sendStatus(403);

		let user;

		try {
			user = (await db.query("SELECT * FROM users where id = $1;", [userId])).rows[0];
			if(!user) res.sendStatus(400);
		}
		catch(e) {
			console.log(e);
			return res.sendStatus(500);
		}

		try {
			const hashPassword = (await db.query("SELECT password FROM users_passwords where user_id = $1;", [user.id])).rows[0].password;

			const isCorrect = await bcrypt.compare(password, hashPassword);
			
			if(!isCorrect) return res.sendStatus(403);
		}
		catch(e) {
			console.log(e);
			return res.sendStatus(500);
		}

		try {
			await db.query("DELETE FROM users where id = $1;", [user.id]);
		}
		catch(e) {
			console.log(e);
			res.sendStatus(500);
		}

		res.cookie("jwt", "", 0);

		res.sendStatus(200);
	}

	async createTemporaryUser() {
		const userId = "T-" + uuid.v4();
		const expires = new Date().getTime() + +process.env.SESSION_EXPIRES_IN;

		let createdUser;
		let createdUserPersonId;

		try {
			createdUser = (await db.query("INSERT INTO temporary_users (id, expires) values($1, $2) RETURNING *;",
			[userId, expires])).rows[0];

			createdUserPersonId = (await db.query("INSERT INTO persons (temporary_user_id) values($1) RETURNING id;", [createdUser.id])).rows[0].id;
		}
		catch(e) {
			console.log(e);
			throw new Error(e);
		}

		return {
			...createdUser,
			personId: createdUserPersonId
		};
	}

	async updateTemporaryUser(userId) {
		const newExpires = new Date().getTime() + +process.env.SESSION_EXPIRES_IN;

		let updatedUser;

		try {
			updatedUser = (await db.query("UPDATE temporary_users SET expires = $1 where id = $2 RETURNING *;", [newExpires, userId])).rows[0];
		}
		catch(e) {
			console.log(e);
			throw new Error(e);
		}

		return updatedUser;
	}
}

module.exports = new UserController();