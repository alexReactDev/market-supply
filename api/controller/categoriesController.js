const db = require("../db");

class CategoriesController {
	async getSubCategoryData(req, res) {
		const reqCategory = req.params.category;
		const reqSubCategory = req.params.subcategory;
		const page = +req.query.page || 1;
		const sort = req.query.sort || "default";
		
		let category;

		try {
			category = (await db.query("SELECT * FROM categories where url_name = $1;", [reqCategory])).rows[0];
		}
		catch(e) {
			return res.sendStatus(500);
		}

		if(!category) return res.sendStatus(404);

		let subcategory;
		
		try {
			subcategory = (await db.query("SELECT * FROM subcategories where url_name = $1 and category_id = $2;", [reqSubCategory, category.id])).rows[0];	
		}
		catch(e) {
			return res.sendStatus(500);
		}

		if(!subcategory) return res.sendStatus(404);

		let subcategoryItemsIds;

		try {
			subcategoryItemsIds = (await db.query("SELECT product_id FROM items_of_subcategories where subcategory_id = $1;", [subcategory.id])).rows.map((item) => item.product_id);
		}
		catch(e) {
			return res.sendStatus(500);
		}

		let products;

		try {
			products = (await db.query("SELECT * FROM products;")).rows;
		}
		catch(e) {
			return res.sendStatus(500);
		}

		const subcategoryItems = products.filter((product) => subcategoryItemsIds.includes(product.id));

		/*
		const subcategoryItemsIds = (await db.query("SELECT product_id FROM items_of_subcategories where subcategory_id = $1;", [subcategory.id])).rows;

		const subcategoryItems = [];

		for(let i = 0; i < subcategoryItemsIds.length; i++) {
			const product = (await db.query("SELECT * FROM products where id = $1;", [subcategoryItemsIds[i].product_id])).rows[0];
			subcategoryItems.push(product);
		}
		*/

		let sortedSubcategoryItems;

		switch(sort) {
			case "low-price":
				sortedSubcategoryItems = subcategoryItems.sort((productA, productB) => productA.price - productB.price);
			break;
			case "high-price":
				sortedSubcategoryItems = subcategoryItems.sort((productA, productB) => productB.price - productA.price);
			break;
			case "low-rate":
				sortedSubcategoryItems = subcategoryItems.sort((productA, productB) => productA.rate - productB.rate);
			break;
			case "high-rate":
				sortedSubcategoryItems = subcategoryItems.sort((productA, productB) => productB.rate - productA.rate);
			break;
			case "alphabet":
				sortedSubcategoryItems = subcategoryItems.sort((productA, productB) => productA.name.localeCompare(productB.name, "en", {sensitivity: "accent"}));
			break;
			default:
				sortedSubcategoryItems = subcategoryItems;
		}

		const pageLength = process.env.PAGE_LENGTH;
		const sortedSubcategoryItemsIds = sortedSubcategoryItems.map((product) => product.id);
		const totalPages = Math.ceil(sortedSubcategoryItems.length / pageLength);
		const data = sortedSubcategoryItemsIds.slice(pageLength * page - pageLength, pageLength * page);

		return res.send({
			page,
			sort,
			totalPages,
			data
		});
	}

	async getCategoryData(req, res) {
		const requestedCategory = req.params.category;
		
		let cat;

		try {
			cat = (await db.query("SELECT * FROM categories where url_name = $1;", [requestedCategory])).rows[0];	
		}
		catch(e) {
			return res.sendStatus(500);
		}

		if(!cat) return res.sendStatus(404);

		let catContent;

		try {
			catContent = (await db.query("SELECT * FROM subcategories where category_id = $1;", [cat.id])).rows;
		}
		catch(e) {
			return res.sendStatus(500);
		}

		return res.send(catContent);
	}

	async getCategoriesList(req, res) {
		let categories;

		try {
			categories = (await db.query("SELECT * FROM categories;")).rows;
		}
		catch(e) {
			return res.sendStatus(500);
		}
	
		return res.send(categories);
	}
}

module.exports = new CategoriesController();