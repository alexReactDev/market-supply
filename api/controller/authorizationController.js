const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
class authorizationController {
	async login(req, res) {
		const { password, payload: email } = req.body;

		let user;

		try {
			user = (await db.query("SELECT * FROM users where email = $1;", [email])).rows[0];
		}
		catch(e) {
			return res.sendStatus(500);
		}

		if(!user) return res.status(400).send("User with such email does not exist.");

		let isPasswordCorrect;

		try {
			const userHashPassword = (await db.query("SELECT password FROM users_passwords where user_id = $1;", [user.id])).rows[0].password;

			isPasswordCorrect = await bcrypt.compare(password, userHashPassword);
		}
		catch(e) {
			return res.sendStatus(500);
		}

		if(!isPasswordCorrect) return res.status(403).send("Incorrect password");

		const tokenData = {
			authorized: true,
			userId: user.id
		}

		const userToken = jwt.sign({data: tokenData}, process.env.JWT_SECRET, {expiresIn: +process.env.SESSION_EXPIRES_IN / 1000});

		res.cookie("jwt", userToken);

		res.sendStatus(200);
	}

	async logout(req, res) {
		res.cookie("jwt", "", {maxAge: 0});

		res.sendStatus(200);
	}
}

module.exports = new authorizationController();