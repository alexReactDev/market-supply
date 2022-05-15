const fixtures = require("../fixtures4.1.json");

class UserController {
	getUser(req, res) {
		res.status(200).json(fixtures.userdata);
	}

	createUser(req, res) {
		res.status(201).json(req.body);
	}

	changeUserProfile(req, res) {
		res.status(200).json(req.body);
	}

	changeUserEmail(req, res) {
		const {email} = req.body;

		res.status(200).json(email);
	}

	changeUserPassword(req, res) {
		res.sendStatus(200);
	}

	deleteUser(req, res) {
		res.sendStatus(200);
	}
}

module.exports = new UserController();