const fixtures = require("../fixtures4.json");

class UserController {
	getUser(req, res) {
		res.status(200).json(fixtures.userdata.userdata);
	}

	getUserOrders(req, res) {
		res.json(fixtures.userdata.orders);
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