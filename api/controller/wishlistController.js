const db = require("../db");

class WishlistController {
	async getWishlistItems(req, res) {
		const personId = req.tokenData.personId;

		let items;

		try {
			items = (await db.query("SELECT * FROM wishlist_products where person_id = $1;", [personId])).rows.map((item) => item.product_id);
		}
		catch(e) {
			return res.sendStatus(500);
		}

		res.send(items);
	}

	async addWishlistItem(req, res) {
		const personId = req.tokenData.personId;
		const productId = req.params.productId;

		let product;

		try {
			product = (await db.query("SELECT * FROM products where id = $1;", [productId])).rows[0];
		}
		catch(e) {
			return res.sendStatus(500);
		}

		if(!product) return res.sendStatus(400);

		try {
			await db.query("INSERT INTO wishlist_products (person_id, product_id) values ($1, $2);", [personId, product.id]);
		}
		catch(e) {
			return res.sendStatus(500);
		}

		this.getWishlistItems(req, res);
	}

	async removeWishlistItem(req, res) {
		const personId = req.tokenData.personId;
		const productId = req.params.productId;

		try {
			await db.query("DELETE FROM wishlist_products where person_id = $1 and product_id = $2;", [personId, productId]);
		}
		catch(e) {
			return res.sendStatus(500);
		}

		this.getWishlistItems(req, res);
	}

	async clearWishlist(req, res) {
		const personId = req.tokenData.personId;

		try {
			await db.query("DELETE FROM wishlist_products where person_id = $1;", [personId]);
		}
		catch(e) {
			return res.sendStatus(500);
		}

		this.getWishlistItems(req, res);
	}
}

module.exports = new WishlistController();