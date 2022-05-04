const Router = require("express").Router;
const { subscribeToNewsletter } = require("../controller/newsletterController");

const router = new Router();

router.post("/", subscribeToNewsletter);

module.exports = router;