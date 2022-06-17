const { getPreferences, changePreferences } = require("../controller/preferencesController");
const authMiddleware = require("../middleware/authMiddleware");

const Router = require("express").Router;

const router = new Router();

router.get("/", authMiddleware(true), getPreferences);
router.patch("/", authMiddleware(true), changePreferences);

module.exports = router;