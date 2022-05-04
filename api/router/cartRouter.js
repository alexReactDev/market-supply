const Router = require("express").Router;
const { getCartItems, addCartItem, removeCartItem } = require("../controller/cartController");

const router = new Router();

router.get("/", getCartItems);
router.post("/", addCartItem);
router.delete("/:productId", removeCartItem);

module.exports = router;