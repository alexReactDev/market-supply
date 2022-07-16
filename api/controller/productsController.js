const db = require("../db");
class ProductsController {
	async getProduct(req, res, next) {
		const id = req.params.id;

		let product;

		try {
			product = (await db.query("SELECT * FROM products where id = $1", [id])).rows[0];
		}
		catch(e) {
			res.sendStatus(500);
		}
	
		if(!product) res.sendStatus(404);

		res.send(product);

		next();
	}
}

module.exports = new ProductsController();