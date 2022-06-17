const Router = require("express").Router;
const { subscribeToNewsletter } = require("../controller/newsletterController");
const authMiddleware = require("../middleware/authMiddleware");

const router = new Router();

router.post("/", authMiddleware(true), subscribeToNewsletter);

module.exports = router;