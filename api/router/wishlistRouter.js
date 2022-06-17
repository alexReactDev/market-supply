const Router = require("express").Router;
const { getWishlistItems, addWishlistItem, removeWishlistItem, clearWishlist } = require("../controller/wishlistController");
const authMiddleware = require("../middleware/authMiddleware");

const router = new Router();

router.get("/", authMiddleware(true), getWishlistItems);
router.post("/", authMiddleware(true), addWishlistItem);
router.delete("/:productId", authMiddleware(true), removeWishlistItem);
router.delete("/", authMiddleware(true), clearWishlist);

module.exports = router;