const Router = require("express").Router;
const { getWishlistItems, addWishlistItem, removeWishlistItem, clearWishlist } = require("../controller/wishlistController");

const router = new Router();

router.get("/", getWishlistItems);
router.post("/", addWishlistItem);
router.delete("/:productId", removeWishlistItem);
router.delete("/", clearWishlist);

module.exports = router;