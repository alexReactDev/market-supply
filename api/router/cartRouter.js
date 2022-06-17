const Router = require("express").Router;
const { getCartItems, addCartItem, removeCartItem, emptyCart, cartItemIncrement, cartItemDecrement } = require("../controller/cartController");
const authMiddleware = require("../middleware/authMiddleware");

const router = new Router();

router.get("/", authMiddleware(true), getCartItems);
router.patch("/", authMiddleware(true), (req, res, next) => {
	if(req.body.action === "increment") return cartItemIncrement(req, res, next);
	if(req.body.action === "decrement") return cartItemDecrement(req, res, next);
	return res.sendStatus(400);
});
router.delete("/:productId", authMiddleware(true), removeCartItem);
router.delete("/", authMiddleware(true), emptyCart);

module.exports = router;