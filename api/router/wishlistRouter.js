const Router = require("express").Router;
const wishlistController = require("../controller/wishlistController");
const { getWishlistItems, addWishlistItem, removeWishlistItem, clearWishlist } = require("../controller/wishlistController");
const authMiddleware = require("../middleware/authMiddleware");

const router = new Router();

router.get("/", authMiddleware(true), getWishlistItems);
router.post("/:productId", authMiddleware(true), addWishlistItem.bind(wishlistController));
router.delete("/:productId", authMiddleware(true), removeWishlistItem.bind(wishlistController));
router.delete("/", authMiddleware(true), clearWishlist.bind(wishlistController));

module.exports = router;