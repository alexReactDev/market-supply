import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { loadCategoryDataWithProducts } from "../../redux/actions";
import { categoriesSelector, URLPathEndSelector } from "../../redux/selectors";
import Loader from "../Loader";
import Product from "../Product";
import style from "./categories.module.scss";

const Categories: FC<{}> = () => {
	
	const categoryName = useSelector(URLPathEndSelector);
	const categories = useSelector(categoriesSelector);
	const dispatch = useDispatch();
	
	useEffect(() => {
		if(
			categories[categoryName] &&
			categories[categoryName].page === 0
		) {
			dispatch(loadCategoryDataWithProducts(categoryName));
		}
	}, [categoryName])
	
	if(!categories[categoryName]) return <Redirect to={"/404"} />

	const { name, sort, done, loading, products, error } = categories[categoryName];

	const changeSort = (newSort: string) => {
		dispatch(loadCategoryDataWithProducts(categoryName, newSort));
	}

	if(error) return(
		<div className="text-center">
			Failed to load data
		</div>
	)

	return(
		<div className={style.category}>
			<div className={style.category__header}>
				<h3 className={style.category__name}>
					{name}
				</h3>
				<ul className={style.category__sortOptions}>
					<li 
						className={`${style.category__sortOption} ${sort === "default" ? style.category__sortOption_active : ""}`}
						onClick={() => changeSort("default")}
					>
						Default
					</li>
					<li 
						className={`${style.category__sortOption} ${sort === "alphabet" ? style.category__sortOption_active : ""}`}
						onClick={() => changeSort("alphabet")}
					>
						Alphabet
					</li>
					<li 
						className={`${style.category__sortOption} ${sort === "low-rate" ? style.category__sortOption_active : ""}`}
						onClick={() => changeSort("low-rate")}
					>
						Low rate
					</li>
					<li 
						className={`${style.category__sortOption} ${sort === "high-rate" ? style.category__sortOption_active : ""}`}
						onClick={() => changeSort("high-rate")}
					>
						Hight rate
					</li>
					<li 
						className={`${style.category__sortOption} ${sort === "low-price" ? style.category__sortOption_active : ""}`}
						onClick={() => changeSort("low-price")}
					>
						Low price
					</li>
					<li 
						className={`${style.category__sortOption} ${sort === "high-price" ? style.category__sortOption_active : ""}`}
						onClick={() => changeSort("high-price")}
					>
						High price
					</li>
				</ul>
				<select className={style.category__selectSortOptions}>
					<option 
						className={style.category__selectSortOption} selected={sort === "default"}
						onClick={() => changeSort("default")}
					>
						Default
					</option>
					<option 
						className={style.category__selectSortOption} selected={sort === "alphabet"}
						onClick={() => changeSort("alphabet")}
					>
						Alphabet
					</option>
					<option 
						className={style.category__selectSortOption} selected={sort === "low-rate"}
						onClick={() => changeSort("low-rate")}
					>
						Low rate
					</option>
					<option 
						className={style.category__selectSortOption} selected={sort === "high-rate"}
						onClick={() => changeSort("high-rate")}
					>
						High rate
					</option>
					<option 
						className={style.category__selectSortOption} selected={sort === "low-price"}
						onClick={() => changeSort("low-price")}
						>
						Low price
					</option>
					<option 
						className={style.category__selectSortOption} selected={sort === "high-price"}
						onClick={() => changeSort("high-price")}
						>
						High price
					</option>
				</select>
			</div>
			<ul className={style.category__itemsList}>
				{products.map((productId) => {
					return(
						<li className={style.category__item} key={productId}>
							<Product className={style.category__product} id={productId} />
						</li>
					)
				})}
			</ul>
			{
				!done && !loading
				?
				<div className={style.category__buttonField}>
					<input
						type="button"
						className={`btn ${style.category__button}`}
						value="Load more"
						onClick={() => dispatch(loadCategoryDataWithProducts(categoryName))}
					/>
				</div>
				:
				null
			}
			{
				loading
				?
				<Loader />
				:
				null
			}
		</div>
	)
}

export default Categories;