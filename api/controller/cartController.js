const fixtures = require("../fixtures3.1.json");

class CartController {
	getCartItems(req, res) {
		res.send(fixtures.cart);
	}

	addCartItem(req, res) {
		const {productId} = req.body;

		res.json(productId);
	}

	removeCartItem(req, res) {
		const {productId} = req.params.productId;

		res.json(productId);
	}
}

module.exports = new CartController();