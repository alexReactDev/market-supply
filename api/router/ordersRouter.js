const Router = require("express").Router;
const { newOrder, getOrders, confirmOrder } = require("../controller/ordersController");

const router = new Router();

router.post("/", newOrder);
router.get("/:userId", getOrders);
router.post("/confirm/:orderId", confirmOrder);

module.exports = router;
