const fixtures = require("../fixtures4.2.json");

class OrdersController {
	newOrder(req, res) {
		const {data, cart} = req.body;

		if(!data || !cart) res.sendStatus(400);

		res.json({
			orderId: "123",
			paymentMethod: data.paymentMethod,
			deliveryMethod: data.deliveryMethod,
			total: Array.from(Object.keys(cart)).reduce((sum, key) => sum + fixtures.products[key].price * cart[key], 0),
			products: Array.from(Object.keys(cart)).map((productId) => { 
				return {
					productId,
					amount: cart[productId],
					total: fixtures.products[productId].price * cart[productId]
				}
			})
		});
	}

	confirmOrder(req, res) {
		res.sendStatus(200);
	}

	getOrders(req, res) {
		let page = +req.query.page;
		if(!page) page = 1;

		if(page > 3) return res.json({
			page,
			done: true,
			orders: []
		})

		if(page === 3) return res.json({
			page,
			done: true,
			orders: fixtures.orders
		})

		if(page < 3) return res.json({
			page,
			done: false,
			orders: fixtures.orders
		})
	}
}

module.exports = new OrdersController();