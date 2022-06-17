const Router = require("express").Router;
const { getCollectionsList, getCollectionData } = require("../controller/collectionsController");


const router = new Router();

router.get("/", getCollectionsList);
router.get("/:collection", getCollectionData);

module.exports = router;