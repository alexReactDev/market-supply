import { FC } from "react";
import { useSelector } from "react-redux";
import { productsSelector } from "../../redux/selectors";
import { IProduct } from "../../redux/reducer/products";
import { Link } from "react-router-dom";
import Price from "../Price";
import Rate from "../Rate";
import style from "./product.module.scss";

import picturePlaceholder from "../../images/products/placeholder.png";

interface IProps {
	className?: string,
	id: string
}

const Product: FC<IProps> = ({ className="", id}) => {

	const product = useSelector(productsSelector)[id];

	if(!product || product.error || product.loading) return null;

	const { name, price, oldPrice, rate, isNew, pictures = []} = product as IProduct;

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