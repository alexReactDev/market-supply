const Router = require("express").Router;
const { getWishlistItems, addWishlistItem, removeWishlistItem } = require("../controller/wishlistController");

const router = new Router();

router.get("/", getWishlistItems);
router.post("/", addWishlistItem);
router.delete("/:productId", removeWishlistItem);

module.exports = router;