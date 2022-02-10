const express = require("express");
const fixtures = require("../fixtures.json");

const router = new express.Router();

router.get("/categories/:category", (req, res, next) => {
	
	const category = req.params.category;

	if(fixtures.categories[category]) {
		res.send(fixtures.categories[category]);
	}

	next();
});

router.get("/product/:id", (req, res, next) => {
	const id = req.params.id;

	if(fixtures.products[id]) {
		res.send(fixtures.products[id]);
	}

	next();
})

router.get("/product-reviews/:id", (req, res) => {
	res.send(fixtures.reviews);
})

router.get("/product-details/:id", (req, res) => {
	res.send(fixtures.details);
})

router.get("/cart", (req, res) => {
	res.send(fixtures.cart);
})

module.exports = router;