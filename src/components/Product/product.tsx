import { FC } from "react";
import style from "./product.module.scss";
import { useSelector } from "react-redux";
import { products as productsSelector } from "../../redux/selectors";
import { IProduct, IProductError } from "../../redux/reducer/products";

import picturePlaceholder from "../../images/products/placeholder.png";
import Price from "../Price";
import Rate from "../Rate";
import { Link } from "react-router-dom";

interface IProps {
	className?: string,
	id: string
}

const Product: FC<IProps> = ({ className="", id}) => {

	const product = useSelector(productsSelector)[id] as IProduct | IProductError;

	if(!product || product.error) return null;

	const { name, price, oldPrice, rate, isNew, pictures} = product as IProduct;

	return(
		<Link to={`/product/${id}`} className={`${className} ${style.product} nav-link`}>
			{
				isNew
				?
				<span className={style.product__newLabel}>New</span>
				:
				null
			}
			<div className={style.product__picture}>
				<img className={style.product__img} src={pictures[0] || picturePlaceholder} alt="product" />
			</div>
			<h4 className={style.product__title}>
				{name}
			</h4>
			<Price className={style.product__price} price={price} oldPrice={oldPrice} />
			<Rate className={style.product__rate} rate={rate} />
		</Link>
	)
}

export default Product;