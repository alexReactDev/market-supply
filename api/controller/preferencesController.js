const db = require("../db");

class PreferencesController {
	async getPreferences(req, res) {
		const userData = req.tokenData;

		let preferences;

		try {
			preferences = (await db.query("SELECT * FROM users_preferences where person_id = $1;", [userData.personId])).rows[0];
		}
		catch(e) {
			console.log(e);
			return res.sendStatus(500);
		}

		let {person_id, ...pref} = preferences;

		return res.send(pref);
	}

	async changeAutoFill(req, res) {
		const userData = req.tokenData;
		const newValue = req.body.payload;

		let alteredPreferences;

		try {
			alteredPreferences = (await db.query("UPDATE users_preferences SET auto_fill = $1 where person_id = $2 RETURNING *;", [newValue, userData.personId])).rows[0];
		}
		catch(e) {
			return res.sendStatus(500);
		}

		let {person_id, ...pref} = alteredPreferences;

		return res.send(pref);
	}

	async changeCurrency(req, res) {
		const userData = req.tokenData;
		const newValue = req.body.payload;

		let alteredPreferences;

		try {
			alteredPreferences = (await db.query("UPDATE users_preferences SET currency = $1 where person_id = $2 RETURNING *;", [newValue, userData.personId])).rows[0];
		}
		catch(e) {
			console.log(e);
			return res.sendStatus(500);
		}

		let {person_id, ...pref} = alteredPreferences;

		return res.send(pref);
	}
}

module.exports = new PreferencesController();