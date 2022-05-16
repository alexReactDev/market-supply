const fixtures = require("../fixtures4.2.json");

class ProductDetailsController {
	getProductDetails(req, res) {
		res.send(fixtures.details);
	}
}

module.exports = new ProductDetailsController();