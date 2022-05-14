const fixtures = require("../fixtures4.json");

class UserController {
	getUser(req, res) {
		res.status(200).json(fixtures.userdata.userdata);
	}

	getUserOrders(req, res) {
		let page = +req.query.page;
		if(!page) page = 1;

		if(page > 3) return res.json({
			page,
			done: true,
			orders: []
		})

		if(page === 3) return res.json({
			page,
			done: true,
			orders: fixtures.userdata.orders
		})

		if(page < 3) return res.json({
			page,
			done: false,
			orders: fixtures.userdata.orders
		})
	}

	getUserPreferences(req, res) {
		res.json({
			autoFill: true
		})
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