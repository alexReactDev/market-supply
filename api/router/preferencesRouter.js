const { getPreferences, changeAutoFill, changeCurrency } = require("../controller/preferencesController");
const authMiddleware = require("../middleware/authMiddleware");

const Router = require("express").Router;

const router = new Router();

router.get("/", authMiddleware(true), getPreferences);
router.put("/auto-fill", authMiddleware(), changeAutoFill);
router.put("/currency", authMiddleware(true), changeCurrency);

module.exports = router;