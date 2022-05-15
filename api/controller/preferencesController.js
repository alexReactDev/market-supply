const fixtures = require("../fixtures4.1.json");

class PreferencesController {
	getPreferences(req, res) {
		res.json(fixtures.preferences);
	}

	changePreferences(req, res) {
		const preferences = req.body;

		res.json({
			...fixtures.preferences,
			...preferences
		})
	}
}

module.exports = new PreferencesController();