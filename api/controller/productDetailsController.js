const db = require("../db");
class ProductDetailsController {
	async getProductDetails(req, res) {
		const id = req.params.id;

		let product;

		try {
			product = (await db.query("SELECT * FROM products where id = $1;", [id])).rows[0];
		}
		catch(e) {
			return res.sendStatus(500);
		}

		if(!product) return res.sendStatus(404);

		let productDetails;

		try {
			productDetails = (await db.query("SELECT * FROM products_details where product_id = $1;", [product.id])).rows[0];
		}
		catch(e) {
			return res.sendStatus(500);
		}

		res.send(productDetails);
	}
}

module.exports = new ProductDetailsController();