const Router = require("express").Router;
const { newOrder, getOrders } = require("../controller/ordersController");

const router = new Router();

router.post("/", newOrder);
router.get("/:userId", getOrders);

module.exports = router;
