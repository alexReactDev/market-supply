const jwt = require("jsonwebtoken");
const { createTemporaryUser, updateTemporaryUser } = require("../controller/userController");

const authMiddleware = (allowUnauthorized) => async (req, res, next) => {
	const token = req.cookies.jwt;

	let invalidToken;
	let tokenData;
	
	try {
		tokenData = jwt.verify(token, process.env.JWT_SECRET).data;
	}
	catch(e) {
		if(e) invalidToken = true;
	}

	if(!token || invalidToken) {
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