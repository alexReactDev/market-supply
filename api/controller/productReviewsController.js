const db = require("../db");
class ProductReviewsController {
	async getProductReviews(req, res) {
		const id = req.params.id;

		const product = (await db.query("SELECT * FROM products where id = $1;", [id])).rows[0];

		if(!product) res.sendStatus(404);

		const reviews = (await db.query("SELECT * FROM products_reviews where product_id = $1;", [product.id])).rows;

		res.send(reviews);
	}

	async addReviewToProduct(req, res) {
		const id = req.params.id;

		const {email, ...data} = req.body;
	
		const product = (await db.query("SELECT * FROM products where id = $1;", [id])).rows[0];

		if(!product) res.sendStatus(400);

		const review = (await db.query("INSERT INTO products_reviews (title, text, rate, timestamp, product_id) values ($1, $2, $3, $4, $5) RETURNING *;",
		[data.title, data.text, data.rate, data.timestamp, product.id])).rows[0];

		res.send(review);
	}
}

module.exports = new ProductReviewsController();