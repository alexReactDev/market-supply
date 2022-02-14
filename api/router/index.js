const express = require("express");
const fixtures = require("../fixtures2.json");

const router = new express.Router();

router.get("/categories/:category", (req, res, next) => {

	const reqCategory = req.params.category;
	const page = +req.query.page || 1;

	if(fixtures.categories[reqCategory]) {
		const category = fixtures.categories[reqCategory];
		const pageLength = process.env.PAGE_LENGTH;
		const totalPages = Math.ceil(category.length / pageLength);
		const data = category.slice(pageLength * page - pageLength, pageLength * page);

		res.send({
			page,
			totalPages,
			data,
		});
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