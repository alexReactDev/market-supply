const db = require("../db");

class CollectionsController {
	async getCollectionData(req, res) {
		const reqCollection = req.params.collection;
		const page = +req.query.page || 1;
		const sort = req.query.sort || "default";
	
		let collection;

		try {
			collection = (await db.query("SELECT * FROM collections where url_name = $1;", [reqCollection])).rows[0];
		}
		catch(e) {
			res.sendStatus(500);
		}

		if(!collection) res.sendStatus(404);

		let collectionItemsIds;

		try {
			collectionItemsIds = (await db.query("SELECT product_id FROM items_of_collections where collection_id = $1;", [collection.id])).rows.map((item) => item.product_id);	
		}
		catch(e) {
			res.sendStatus(500);
		}
		
		let products;

		try {
			products = (await db.query("SELECT * FROM products;")).rows;
		}
		catch(e) {
			res.sendStatus(500);
		}

		const collectionItems = products.filter((product) => collectionItemsIds.includes(product.id));

		let sortedCollectionItems;

		switch(sort) {
			case "low-price":
				sortedCollectionItems = collectionItems.sort((productA, productB) => productA.price - productB.price);
			break;
			case "high-price":
				sortedCollectionItems = collectionItems.sort((productA, productB) => productB.price - productA.price);
			break;
			case "low-rate":
				sortedCollectionItems = collectionItems.sort((productA, productB) => productA.rate - productB.rate);
			break;
			case "high-rate":
				sortedCollectionItems = collectionItems.sort((productA, productB) => productB.rate - productA.rate);
			break;
			case "alphabet":
				sortedCollectionItems = collectionItems.sort((productA, productB) => productA.name.localeCompare(productB.name, "en", {sensitivity: "accent"}));
			break;
			default:
				sortedCollectionItems = collectionItems;
		}

		const pageLength = process.env.PAGE_LENGTH;
		const sortedCollectionItemsIds = sortedCollectionItems.map((product) => product.id);
		const totalPages = Math.ceil(sortedCollectionItems.length / pageLength);
		const data = sortedCollectionItemsIds.slice(pageLength * page - pageLength, pageLength * page);

		res.send({
			page,
			sort,
			totalPages,
			data
		});
	}

	async getCollectionsList(req, res) {
		let collections;
		
		try {
			collections = (await db.query("SELECT * FROM collections;")).rows;
		}
		catch(e) {
			res.sendStatus(500);
		}

		res.send(collections);
	}
}

module.exports = new CollectionsController();