class WishlistController {
	getWishlistItems(req, res) {
		res.json([]);
	}

	addWishlistItem(req, res) {
		const {id} = req.body;

		res.status(202).json(id);
	}

	removeWishlistItem(req, res) {
		const id = req.params.productId;

		res.json(id);
	}

	clearWishlist(req, res) {
		res.sendStatus(200);
	}
}

module.exports = new WishlistController();