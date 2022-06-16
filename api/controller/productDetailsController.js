const db = require("../db");
class ProductDetailsController {
	async getProductDetails(req, res) {
		const id = req.params.id;

		const product = (await db.query("SELECT * FROM products where id = $1;", [id])).rows[0];

		if(!product) res.sendStatus(404);

		const productDetails = (await db.query("SELECT * FROM products_details where product_id = $1;", [product.id])).rows[0];

		res.send(productDetails);
	}
}

module.exports = new ProductDetailsController();