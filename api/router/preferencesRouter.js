const { getPreferences, changePreferences } = require("../controller/preferencesController");

const Router = require("express").Router;

const router = new Router();

router.get("/", getPreferences);
router.patch("/", changePreferences);

module.exports = router;