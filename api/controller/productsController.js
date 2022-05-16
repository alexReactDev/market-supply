const fixtures = require("../fixtures4.2.json");

class ProductsController {
	getProduct(req, res, next) {
		const id = req.params.id;

		if(fixtures.products[id]) {
			res.send(fixtures.products[id]);
		}
	
		next();
	}
}

module.exports = new ProductsController();