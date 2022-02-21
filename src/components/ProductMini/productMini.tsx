import { FC } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IProduct, IProductError } from "../../redux/reducer/products";
import { productsSelector } from "../../redux/selectors";
import style from "./productMini.module.scss";

import picturePlaceholder from "../../images/products/placeholder.png";
import Price from "../Price";
import Rate from "../Rate";

interface IProps {
	className?: string,
	id: string
}

const ProductMini: FC<IProps> = ({ className="", id }) => {

	const product = useSelector(productsSelector)[id] as IProduct | IProductError;

	if(!product || product.error) return null;

	const { name, price, oldPrice, rate, pictures} = product as IProduct;

	return(
		<Link to={`/product/${id}`} className={`${className} ${style.product} nav-link`}>
			<div className={style.product__picture}>
				<img src={pictures[0] || picturePlaceholder} alt={name} />
			</div>
			<div className={style.product__body}>
				<h5 className={style.product__title}>
					{name}
				</h5>
				<Price className={style.product__price} price={price} oldPrice={oldPrice} />
				<Rate className={style.product__price} rate={rate} />
			</div>
		</Link>
	)
}

export default ProductMini;