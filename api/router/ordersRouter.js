const Router = require("express").Router;
const { newOrder, getOrders, confirmOrder } = require("../controller/ordersController");
const authMiddleware = require("../middleware/authMiddleware");

const router = new Router();

router.post("/", authMiddleware(true), newOrder);
router.post("/confirm/:orderId", authMiddleware(true), confirmOrder);
router.get("/:userId", authMiddleware(), getOrders);

module.exports = router;
