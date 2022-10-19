const db = require("../db");

class SearchController {
	async productsSearch(req, res) {
		const search = req.query.q;
		const page = +req.query.page || 1;

		let products;

		try {
			products = (await db.query("SELECT * FROM products;")).rows;
		}
		catch(e) {
			return res.sendStatus(500);
		}

		const matchingProductsIds = products.filter((product) => product.name.includes(search)).map((product) => product.id);

		const result = matchingProductsIds.slice(process.env.PAGE_LENGTH * page - process.env.PAGE_LENGTH, process.env.PAGE_LENGTH * page);

		return res.send({
			search,
			page,
			done: matchingProductsIds.length <= process.env.PAGE_LENGTH * page,
			result
		});
	}
}

module.exports = new SearchController();