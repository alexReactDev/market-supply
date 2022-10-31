const jwt = require("jsonwebtoken");
const { createTemporaryUser, updateTemporaryUser } = require("../controller/userController");
const db = require("../db");

const authMiddleware = (allowUnauthorized) => async (req, res, next) => {
	const token = req.cookies.jwt;

	let tokenData;
	let invalidToken;
	let userExist;
	
	try {
		tokenData = jwt.verify(token, process.env.JWT_SECRET).data;
	}
	catch(e) {
		if(e) invalidToken = true;
	}

	if(!invalidToken) {
		try {
			userExist = (await db.query("SELECT id FROM persons where id = $1;", [tokenData.personId])).rows[0];
		}
		catch(e) {
			console.log(e);
			throw e;
		}
	}

	if(!token || invalidToken || !userExist) {
		const tempUser = await createTemporaryUser();
		const tokenData = {
			data: {
				authorized: false,
				userId: tempUser.id,
				personId: tempUser.personId
			}
		};

		const tempUserToken = jwt.sign(tokenData, process.env.JWT_SECRET, {expiresIn: +process.env.SESSION_EXPIRES_IN / 1000});

		res.cookie("jwt", tempUserToken);

		if(!allowUnauthorized) return res.sendStatus(401);

		req.tokenData = tokenData.data;

		return next();
	}

	if(!tokenData.authorized) updateTemporaryUser(tokenData.userId);

	const updatedToken = jwt.sign({data: {...tokenData}}, process.env.JWT_SECRET, {expiresIn: +process.env.SESSION_EXPIRES_IN / 1000});

	res.cookie("jwt", updatedToken);

	if(!tokenData.authorized && !allowUnauthorized) return res.sendStatus(401);

	req.tokenData = tokenData;

	next();
}

module.exports = authMiddleware;