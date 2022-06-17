const Router = require("express").Router;
const { getCollectionsList, getCollectionData } = require("../controller/collectionsController");
const authMiddleware = require("../middleware/authMiddleware");


const router = new Router();

router.get("/", authMiddleware(true), getCollectionsList);
router.get("/:collection", authMiddleware(true), getCollectionData);

module.exports = router;