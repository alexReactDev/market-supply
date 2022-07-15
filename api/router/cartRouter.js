const Router = require("express").Router;
const cartController = require("../controller/cartController");
const { getCartItems, removeCartItem, emptyCart, cartItemIncrement, cartItemDecrement } = require("../controller/cartController");
const authMiddleware = require("../middleware/authMiddleware");

const router = new Router();

router.get("/", authMiddleware(true), getCartItems);
router.patch("/increment/:productId", authMiddleware(true), cartItemIncrement.bind(cartController));
router.patch("/decrement/:productId", authMiddleware(true), cartItemDecrement.bind(cartController));
router.delete("/:productId", authMiddleware(true), removeCartItem.bind(cartController));
router.delete("/", authMiddleware(true), emptyCart.bind(cartController));

module.exports = router;