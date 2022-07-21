const db = require("../db");
class ProductsController {
	async getProduct(req, res, next) {
		const id = req.params.id;

		let product;

		try {
			product = (await db.query("SELECT * FROM products where id = $1", [id])).rows[0];
		}
		catch(e) {
			return res.sendStatus(500);
		}
	
		if(!product) res.sendStatus(404);

		let productPictures;

		try {
			productPictures = (await db.query("SELECT picture from products_pictures where product_id = $1;", [product.id])).rows.map((productPicture) => productPicture.picture);
		}
		catch(e) {
			console.log(e);
			return res.sendStatus(500);
		}

		res.send({
			...product,
			pictures: productPictures
		});

		next();
	}
}

module.exports = new ProductsController();