const { login, logout } = require("../controller/authorizationController");

const Router = require("express").Router;

const router = new Router();

router.post("/login", login);
router.post("/logout", logout);

module.exports = router;