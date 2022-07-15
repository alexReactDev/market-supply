const Router = require("express").Router;
const { newOrder, getUserOrders, confirmOrder } = require("../controller/ordersController");
const authMiddleware = require("../middleware/authMiddleware");

const router = new Router();

router.post("/", authMiddleware(true), newOrder);
router.post("/confirm/:link", authMiddleware(true), confirmOrder);
router.get("/:userId", authMiddleware(), getUserOrders);

module.exports = router;
