const Router = require("express").Router;
const { newCheckout } = require("../controller/checkoutController");

const router = new Router();

router.post("/", newCheckout);

module.exports = router;