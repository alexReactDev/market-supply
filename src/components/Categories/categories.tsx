import React, { FC, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { ICategory } from "../../redux/reducer/categories";
import { ICollection } from "../../redux/reducer/collections";
import Loader from "../Loader";
import Product from "../Product";
import style from "./categories.module.scss";

interface IProps {
	cat: ICategory | ICollection,
	loadCategory: (catId: number, sort?: string) => void,
	loadCategoryProducts: (catId: number) => void
}

const Categories: FC<IProps> = ({ cat, loadCategory, loadCategoryProducts}) => {
	
	const dispatch = useDispatch();
	
	useEffect(() => {
		if(!cat.loaded && !cat.loading && !cat.error) dispatch(loadCategory(cat.id));
	}, [cat])
	

	const { name, sort, done, loading, products, error } = cat;

	const changeSort = (newSort: string) => {
		dispatch(loadCategory(cat.id, newSort));
	}

	if(error) return <Redirect to="/error" />

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
				<select 
					className={style.category__selectSortOptions}
					onChange={(e: React.ChangeEvent<HTMLSelectElement>) => changeSort(e.target.value)}
				>
					<option 
						className={style.category__selectSortOption} 
						selected={sort === "default"}
						value="default"
					>
						Default
					</option>
					<option 
						className={style.category__selectSortOption} 
						selected={sort === "alphabet"}
						value="alphabet"
					>
						Alphabet
					</option>
					<option 
						className={style.category__selectSortOption} 
						selected={sort === "low-rate"}
						value="low-rate"
					>
						Low rate
					</option>
					<option 
						className={style.category__selectSortOption} 
						selected={sort === "high-rate"}
						value="high-rate"
					>
						High rate
					</option>
					<option 
						className={style.category__selectSortOption} 
						selected={sort === "low-price"}
						value="low-price"
						>
						Low price
					</option>
					<option 
						className={style.category__selectSortOption} 
						selected={sort === "high-price"}
						value="high-price"
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
						onClick={() => dispatch(loadCategoryProducts(cat.id))}
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