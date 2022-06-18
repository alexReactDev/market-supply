const { login, logout } = require("../controller/authorizationController");
const authMiddleware = require("../middleware/authMiddleware");

const Router = require("express").Router;

const router = new Router();

router.post("/login", authMiddleware(true), login);
router.post("/logout", logout);

module.exports = router;