import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { productsSelector } from "../../redux/selectors";
import { IProduct } from "../../redux/reducer/products";
import { Link } from "react-router-dom";
import Price from "../Price";
import Rate from "../Rate";
import style from "./product.module.scss";

import picturePlaceholder from "../../images/products/placeholder.png";
import { loadProductByIdAction } from "../../redux/actions";

interface IProps {
	className?: string,
	id: string
}

const Product: FC<IProps> = ({ className="", id}) => {

	const product = useSelector(productsSelector)[id];
	const dispatch = useDispatch();

	useEffect(() => {
		if(!product || (!product.loading && !product.loaded && !product.error)) {
			dispatch(loadProductByIdAction(id));
		}
	})

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
				<img 
					className={style.product__img} 
					src={pictures[0] || picturePlaceholder} 
					alt="product" 
					onError={(e: any) => e.target.src = picturePlaceholder}
					onMouseDown={(e: any) => e.target.classList.add(style.product__img_active)}
					onMouseUp={(e: any) => e.target.classList.remove(style.product__img_active)}
					onMouseLeave={(e: any) => e.target.classList.remove(style.product__img_active)}
					/>
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