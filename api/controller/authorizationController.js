class authorizationController {
	login(req, res) {
		res.sendStatus(200);
	}

	logout(req, res) {
		res.sendStatus(200);
	}
}

module.exports = new authorizationController();