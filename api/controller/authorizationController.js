const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
class authorizationController {
	async login(req, res) {
		const previousUserTokenData = req.tokenData;
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

		let userPersonId;

		try {
			userPersonId = (await db.query("SELECT id FROM persons where user_id = $1;", [user.id])).rows[0].id;
		}
		catch(e) {
			console.log(e);
			res.sendStatus(500);
		}

		if(previousUserTokenData && !previousUserTokenData.authorized) {
			try {
				const tempUserCartProducts = (await db.query("SELECT * FROM cart_products where person_id = $1;", [previousUserTokenData.personId])).rows;

				tempUserCartProducts.forEach(async (tempUserCartProduct) => {
					const userCartProduct = (await db.query("SELECT * FROM cart_products where person_id = $1;", [userPersonId])).rows[0];

					if(userCartProduct) {
						const sum = tempUserCartProduct.amount + userCartProduct.amount;
						await db.query("UPDATE cart_products SET amount = $1 where person_id = $2;", [sum, userPersonId]);
					}
					else {
						await db.query("INSERT INTO cart_products (person_id, product_id, amount) values($1, $2, $3);", [userPersonId, tempUserCartProduct.product_id, tempUserCartProduct.amount]);
					}
				})
			}
			catch(e) {
				console.log(e);
				res.sendStatus(500);
			}

			try {
				const tempUserWishlistProducts = (await db.query("SELECT * FROM wishlist_products where person_id = $1;", [previousUserTokenData.personId])).rows;

				tempUserWishlistProducts.forEach(async (tempUserWishlistProduct) => {
					const userWishlistProduct = (await db.query("SELECT * FROM wishlist_products where person_id = $1;", [userPersonId])).rows[0];

					if(!userWishlistProduct) {
						await db.query("INSERT INTO wishlist_products (person_id, product_id) values($1, $2);", [userPersonId, tempUserWishlistProduct.product_id]);
					}
				})
			}
			catch(e) {
				console.log(e);
				res.sendStatus(500);
			}
		}

		const tokenData = {
			authorized: true,
			userId: user.id,
			personId: userPersonId
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