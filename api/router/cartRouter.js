const Router = require("express").Router;
const { getCartItems, addCartItem, removeCartItem, emptyCart, cartItemIncrement, cartItemDecrement } = require("../controller/cartController");

const router = new Router();

router.get("/", getCartItems);
router.patch("/", (req, res, next) => {
	if(req.body.action === "increment") return cartItemIncrement(req, res, next);
	if(req.body.action === "decrement") return cartItemDecrement(req, res, next);
	return res.sendStatus(400);
});
router.delete("/:productId", removeCartItem);
router.delete("/", emptyCart);

module.exports = router;