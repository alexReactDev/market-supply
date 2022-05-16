const fixtures = require("../fixtures4.2.json");

class OrdersController {
	newOrder(req, res) {
		res.send(fixtures.orders[0]);
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