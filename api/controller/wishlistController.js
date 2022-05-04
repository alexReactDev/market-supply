class WishlistController {
	getWishlistItems(req, res) {
		res.json([]);
	}

	addWishlistItem(req, res) {
		const {productId} = req.body;

		res.json(productId);
	}

	removeWishlistItem(req, res) {
		const {productId} = req.params.productId;

		res.json(productId);
	}
}

module.exports = new WishlistController();