class UserController {
	getUser(req, res) {
		res.status(200).json({
			name: "John",
			surname: "Doe",
			phone: "+ 1 234 567 8910",
			town: "New York",
			street: "Main Road",
			house: "1",
			apartment: "12",
			zip: "12345"
		});
	}

	createUser(req, res) {
		res.sendStatus(200);
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