const fixtures = require("../fixtures4.2.json");
fixtures.productReviews = {};

class ProductReviewsController {
	getProductReviews(req, res) {
		const id = req.params.id;

		if(fixtures.productReviews[id]) {
			res.send(fixtures.productReviews[id])
		}
		else {
			res.send(fixtures.reviews);
		}
	}

	addReviewToProduct(req, res) {
		const id = req.params.id;

		const {email, ...review} = req.body.review;
	
		fixtures.productReviews[id] ? fixtures.productReviews[id].push(review) : fixtures.productReviews[id] = [review, ...fixtures.reviews];
		res.send(review);
	}
}

module.exports = new ProductReviewsController();