const Router = require("express").Router;
const { getOutlets } = require("../controller/outletsController");
const authMiddleware = require("../middleware/authMiddleware");

const router = new Router();

router.get("/", authMiddleware(true), getOutlets);

module.exports = router;