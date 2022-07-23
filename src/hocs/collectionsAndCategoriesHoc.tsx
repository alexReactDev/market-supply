import { FC } from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import Categories from "../components/Categories";
import { loadCategoryProducts as loadCategoryProductsAction, loadCollectionData, loadMoreCategoryProducts, loadMoreCollectionProducts } from "../redux/actions";
import { categoriesSelector, collectionsSelector, URLPathSelector } from "../redux/selectors";

const CollectionsAndCategoriesHoc: FC<{}> = () => {

	const path = useSelector(URLPathSelector);
	const categories = useSelector(categoriesSelector);
	const collections = useSelector(collectionsSelector);
	
	let cat;
	let loadCategory;
	let loadCategoryProducts;

	if(path.startsWith("/categories")) {
		const catName = path.split("/")[2] + "/" + path.split("/")[3];

		cat = categories[catName];
		loadCategory = loadCategoryProductsAction;
		loadCategoryProducts = loadMoreCategoryProducts;
	}
	else if (path.startsWith("/collections")) {
		const colName = path.split("/")[2];

		cat = collections[colName];
		loadCategory = loadCollectionData;
		loadCategoryProducts = loadMoreCollectionProducts;
	}
	else {
		return <Redirect to="/error" />
	}

	if(!cat) return <Redirect to="/404" />

	return (
		<Categories cat={cat} loadCategory={loadCategory} loadCategoryProducts={loadCategoryProducts} />
	)
}

export default CollectionsAndCategoriesHoc;