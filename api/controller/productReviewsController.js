const db = require("../db");
class ProductReviewsController {
	async getProductReviews(req, res) {
		const id = req.params.id;

		let product;

		try {
			product = (await db.query("SELECT * FROM products where id = $1;", [id])).rows[0];
		}
		catch(e) {
			return res.sendStatus(500);
		}

		if(!product) return res.sendStatus(404);

		let reviews;

		try {
			reviews = (await db.query("SELECT * FROM products_reviews where product_id = $1;", [product.id])).rows.map((review) => ({...review, timestamp: +review.timestamp}));
		}
		catch(e) {
			return res.sendStatus(500);
		}

		return res.send(reviews);
	}

	async addReviewToProduct(req, res) {
		const id = req.params.id;

		const {email, ...data} = req.body;

		let product;
	
		try {
			product = (await db.query("SELECT * FROM products where id = $1;", [id])).rows[0];
		}
		catch(e) {
			console.log(e);
			return res.sendStatus(500);
		}

		if(!product) return res.sendStatus(400);

		let review;

		try {
			review = (await db.query("INSERT INTO products_reviews (title, text, rate, timestamp, product_id) values ($1, $2, $3, $4, $5) RETURNING *;",
			[data.title, data.text, data.rate, data.timestamp, product.id])).rows[0];
		}
		catch(e) {
			console.log(e);
			return res.sendStatus(500);
		}
		
		return res.send({
			...review,
			timestamp: +review.timestamp
		});
	}
}

module.exports = new ProductReviewsController();