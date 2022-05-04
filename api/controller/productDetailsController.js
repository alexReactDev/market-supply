const fixtures = require("../fixtures3.1.json");

class ProductDetailsController {
	getProductDetails(req, res) {
		res.send(fixtures.details);
	}
}

module.exports = new ProductDetailsController();