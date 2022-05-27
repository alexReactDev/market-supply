const fixtures = require("../fixtures4.2.json");

class SearchController {
	productsSearch(req, res) {
		const search = req.params.search;
		const page = +req.query.page || 1;

		if(!search) res.sendStatus(400);

		const found = [];
		
		Array.from(Object.values(fixtures.products)).forEach((product) => {
			if(product.name.includes(search)) found.push(product.id);
		});

		const result = found.slice(20 * page - 20, 20 * page);

		res.json({
			search,
			page,
			done: found.length <= 20 * page,
			result
		})
	}
}

module.exports = new SearchController();