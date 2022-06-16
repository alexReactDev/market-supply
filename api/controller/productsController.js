const db = require("../db");
class ProductsController {
	async getProduct(req, res, next) {
		const id = req.params.id;

		const product = (await db.query("SELECT * FROM products where id = $1", [id])).rows[0];
	
		if(!product) res.sendStatus(404);

		res.send(product);

		next();
	}
}

module.exports = new ProductsController();