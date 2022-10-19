const db = require("../db");
const uuid = require("uuid");

class OrdersController {
	async newOrder(req, res) {
		const { payload } = req.body;

		let orderedProducts;

		try {
			orderedProducts = await Promise.all(Object.keys(payload.products).map(async (productId) => (await db.query("SELECT * FROM products where id = $1;", [productId])).rows[0]));
		}
		catch(e) {
			console.log(e);
			return res.sendStatus(500);
		}
		
		if(!orderedProducts.every((product) => product)) return res.sendStatus(400);

		const total = orderedProducts.reduce((total, product) => total + product.price * payload.products[product.id], 0);

		let createdOrder;

		try {
			createdOrder = (await db.query("INSERT INTO orders (name, surname, phone, email, delivery_method, payment_method, total, confirmed) values($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;",
			[payload.name, payload.surname, payload.phone, payload.email, payload.delivery_method, payload.payment_method, total, false])).rows[0];
		}
		catch(e) {
			console.log(e);
			return res.sendStatus(500);
		}

		try {
			if(createdOrder.delivery_method === "delivery") {
				await db.query("INSERT INTO orders_delivery_data (order_id, town, street, house, apartment_no, zip, preferred_date) values ($1, $2, $3, $4, $5, $6, $7);",
				[createdOrder.id, payload.town, payload.street, payload.house, payload.apartment, payload.zip, payload.preferred_date]);
			}
			else if(createdOrder.delivery_method === "pickup") {
				await db.query("INSERT INTO orders_pickup_outlet (order_id, outlet_id) values ($1, $2);", [createdOrder.id, +payload.outlet_id]);
			}
		}
		catch(e) {
			console.log(e);
			return res.sendStatus(500);
		}

		let orderProducts;
		
		try {
			orderProducts = await Promise.all(orderedProducts.map(async (product) => {
				const amount = payload.products[product.id];

				const orderProduct = (await db.query("INSERT INTO orders_products (order_id, product_id, amount, total) values ($1, $2, $3, $4) RETURNING product_id, amount, total;",
				[createdOrder.id, product.id, amount, product.price * amount])).rows[0];

				return orderProduct;
			}))
		}
		catch(e) {
			console.log(e);
			return res.sendStatus(500);
		}

		let confirmationLink;

		try {
			confirmationLink = (await db.query("INSERT INTO orders_confirmation_link (order_id, link, expires) values ($1, $2, $3) RETURNING link;",
			[createdOrder.id, uuid.v4(), new Date().getTime() + +process.env.ORDER_CONFIRMATION_LINK_EXPIRES_IN])).rows[0].link;
		}
		catch(e) {
			console.log(e);
			return res.sendStatus(500);
		}

		return res.send({
			...createdOrder,
			products: orderProducts,
			confirmationLink
		});
	}

	async confirmOrder(req, res) {
		const confirmationLink =  req.params.link;

		let order;

		try {
			order = (await db.query("SELECT * from orders_confirmation_link where link = $1;", [confirmationLink])).rows[0];
		}
		catch(e) {
			return res.sendStatus(500);
		}

		if(!order) return res.sendStatus(400);

		if(new Date().getTime() >= order.expires) return res.sendStatus(410);

		let confirmedOrder;

		try {
			confirmedOrder = (await db.query("UPDATE orders SET confirmed = true where id = $1 RETURNING *;", [order.order_id])).rows[0];
		}
		catch(e) {
			return res.sendStatus(500);
		}

		if(req.tokenData.authorized) {
			let confirmedOrderProducts;

			try {
				confirmedOrderProducts = (await db.query("SELECT * FROM orders_products where order_id = $1;", [confirmedOrder.id])).rows;
			}
			catch(e) {
				return res.sendStatus(500);
			}

			try {
				await Promise.all(confirmedOrderProducts.map((product) => db.query("INSERT INTO users_orders (user_id, product_id, amount, total, delivery_method, payment_method) values ($1, $2, $3, $4, $5, $6);",
				[req.tokenData.userId, product.product_id, product.amount, product.total, confirmedOrder.delivery_method, confirmedOrder.payment_method])));
			}
			catch(e) {
				console.log(e);
				return res.sendStatus(500);
			}
		}

		try {
			await db.query("DELETE FROM cart_products where person_id = $1;", [req.tokenData.personId]);
		}
		catch(e) {
			console.log(e);
			return res.sendStatus(500);
		}

		return res.sendStatus(200);
	}

	async getUserOrders(req, res) {
		const userId = req.params.userId;
		const page = +req.query.page || 1;

		if(userId !== req.tokenData.userId) return res.sendStatus(403);

		let userOrders;

		try {
			userOrders = (await db.query("SELECT * FROM users_orders where user_id = $1;", [userId])).rows;
		}
		catch(e) {
			return res.sendStatus(500);
		}

		const pageLength = process.env.USERPROFILE_ORDERS_PAGE_LENGTH;
		const data = userOrders.concat().reverse().slice(pageLength * page - pageLength, pageLength * page);
		const totalPages = Math.ceil(userOrders.length / pageLength);

		return res.send({
			page,
			totalPages,
			data
		});
	}

	async deleteExpiredOrdersAndConfirmationLinks() {
		const confirmationLinks = (await db.query("SELECT * FROM orders_confirmation_link")).rows;

		try {
			await Promise.all(confirmationLinks.map(async (link) => {
				if(link.expires <= new Date().getTime()) {
					const order = (await db.query("SELECT * FROM orders where id = $1;", [link.order_id])).rows[0];

					if(!order.confirmed) await db.query("DELETE FROM orders where id = $1;", [order.id]);

					await db.query("DELETE FROM orders_confirmation_link where order_id = $1;", [link.order_id]);
				}
			}))
		}
		catch(e) {
			console.log(e);
			throw e;
		}
	}
}

module.exports = new OrdersController();