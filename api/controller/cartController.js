const db = require("../db");
class CartController {
	async getCartItems(req, res) {
		const personId = req.tokenData.personId;
		
		let items;

		try {
			items = (await db.query("SELECT * FROM cart_products where person_id = $1;", [personId])).rows;
		}
		catch(e) {
			console.log(e);
			return res.sendStatus(500);
		}

		const products = {};

		items.forEach((item) => products[item.product_id] = item.amount);

		const total = (await Promise.all(items.map(async (item) => {
			const product = (await db.query("SELECT * FROM products where id = $1;", [item.product_id])).rows[0];

			return product.price * item.amount;
		}))).reduce((total, productTotal) => total + productTotal, 0);

		return res.send({
			products,
			total
		});
	}

	async cartItemIncrement(req, res) {
		const personId = req.tokenData.personId;
		const productId = req.params.productId;
		const { payload: amount } = req.body;

		let product;

		try {
			product = (await db.query("SELECT * FROM products where id = $1;", [productId])).rows[0];
		}
		catch(e) {
			return res.sendStatus(500);
		}

		if(!product) return res.sendStatus(400);

		let cartItem;

		try {
			cartItem = (await db.query("SELECT * FROM cart_products where person_id = $1 and product_id = $2;", [personId, productId])).rows[0];
		}
		catch(e) {
			console.log(e);
			return res.sendStatus(500);
		}

		try {
			if(cartItem) {
				await db.query("UPDATE cart_products SET amount = $1 where person_id = $2 and product_id = $3;", [cartItem.amount + amount, personId, cartItem.product_id]);
			}
			else {
				await db.query("INSERT INTO cart_products (person_id, product_id, amount) values ($1, $2, $3);", [personId, productId, amount]);
			}
		}
		catch(e) {
			console.log(e);
			return res.sendStatus(500);
		}

		this.getCartItems(req, res);
	}

	async cartItemDecrement(req, res) {
		const personId = req.tokenData.personId;
		const product = req.params.productId;
		const { payload: amount } = req.body;

		let cartItem;

		try {
			cartItem = (await db.query("SELECT * FROM cart_products where person_id = $1 and product_id = $2;", [personId, product])).rows[0];
		}
		catch(e) {
			return res.sendStatus(500);
		}

		if(!cartItem) return res.sendStatus(400);

		let newAmount = cartItem.amount - amount;

		try {
			if(newAmount <= 0) {
				await (db.query("DELETE FROM cart_products where person_id = $1 and product_id = $2;", [personId, product]));
			}
			else {
				await (db.query("UPDATE cart_products SET amount = $1 where person_id = $2 and product_id = $3;", [newAmount, personId, product]));
			}
		}
		catch(e) {
			return res.sendStatus(500);
		}

		this.getCartItems(req, res);
	}

	async removeCartItem(req, res) {
		const personId = req.tokenData.personId;
		const product = req.params.productId;

		try {
			await db.query("DELETE FROM cart_products where person_id = $1 and product_id = $2;", [personId, product]);
		}
		catch(e) {
			return res.sendStatus(500);
		}

		this.getCartItems(req, res);
	}

	async emptyCart(req, res) {
		const personId = req.tokenData.personId;

		try {
			await db.query("DELETE FROM cart_products where person_id = $1;", [personId]);
		}
		catch(e) {
			return res.sendStatus(500);
		}

		this.getCartItems(req, res);
	}
}

module.exports = new CartController();