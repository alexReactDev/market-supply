const db = require("../db");

class OutletsController {
	async getOutlets(req, res) {		
		let outlets;

		try {
			outlets = (await db.query("SELECT * FROM outlets;")).rows;
		}
		catch(e) {
			return res.sendStatus(500);
		}

		res.send(outlets);
	}
}

module.exports = new OutletsController();