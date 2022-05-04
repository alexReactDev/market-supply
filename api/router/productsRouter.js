const Router = require("express").Router;
const { getProductDetails } = require("../controller/productDetailsController");
const { getProductReviews, addReviewToProduct } = require("../controller/productReviewsController");
const { getProduct } = require("../controller/productsController");

const router = new Router();

router.get("/:id", getProduct);
router.get("/:id/reviews", getProductReviews);
router.post("/:id/reviews", addReviewToProduct);
router.get("/:id/details", getProductDetails);

module.exports = router;