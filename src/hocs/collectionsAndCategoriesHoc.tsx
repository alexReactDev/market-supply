import { FC } from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import Categories from "../components/Categories";
import { categoriesSelector, collectionsSelector, URLPathSelector } from "../redux/selectors";

const CollectionsAndCategoriesHoc: FC<{}> = () => {

	const path = useSelector(URLPathSelector);
	const categories = useSelector(categoriesSelector);
	const collections = useSelector(collectionsSelector);
	
	let cat;

	if(path.startsWith("/categories")) {
		const catName = path.split("/")[2] + "/" + path.split("/")[3];

		cat = categories[catName];
	}
	else if (path.startsWith("/collections")) {
		const colName = path.split("/")[2];

		cat = collections[colName];
	}
	else {
		return <Redirect to="/error" />
	}

	console.log(cat);

	return (
		<Categories cat={cat} />
	)
}

export default CollectionsAndCategoriesHoc;