const fixtures = require("../fixtures4.2.json");

class CartController {
	getCartItems(req, res) {
		let total = 0;

		Array.from(Object.keys(fixtures.cart)).forEach((productId) => {
			total += fixtures.products[productId].price;
		})

		res.json({
			total,
			products: fixtures.cart
		});
	}

	cartItemIncrement(req, res) {
		const {id, amount} = req.body;

		res.json({
			id,
			amount
		});
	}

	cartItemDecrement(req, res) {
		const {id, amount} = req.body;

		res.json({
			id,
			amount
		});
	}

	removeCartItem(req, res) {
		const id = req.params.productId;

		res.json(id);
	}

	emptyCart(req, res) {
		res.sendStatus(200);
	}
}

module.exports = new CartController();