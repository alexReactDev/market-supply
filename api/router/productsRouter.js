const Router = require("express").Router;
const { getProductDetails } = require("../controller/productDetailsController");
const { getProductReviews, addReviewToProduct } = require("../controller/productReviewsController");
const { getProduct } = require("../controller/productsController");

const router = new Router();

router.get("/:id", getProduct);
router.get("/reviews/:id", getProductReviews);
router.post("/reviews/:id", addReviewToProduct);
router.get("/details/:id", getProductDetails);

module.exports = router;