import { FC } from "react"
import { useDispatch, useSelector } from "react-redux";
import { removeFromWhitelistAction } from "../../redux/actions";
import { IProductWithProps, whitelistProductsWithPropsSelector } from "../../redux/selectors";
import AddToCart from "../AddToCart";
import Price from "../Price";
import style from "./whitelist.module.scss";

const Whitelist: FC<{}> = () => {

	const products = useSelector(whitelistProductsWithPropsSelector) as IProductWithProps[];
	const dispatch = useDispatch();

	return(
	<div className={style.whitelist}>
		<h2 className={style.whitelist__title}>
			Whitelist
		</h2>
		<div className={style.whitelist__table}>
			<div className={style.whitelist__tableHeader}>
				<span className={style.whitelist__tableItem}>
					Item
				</span>
				<span className={style.whitelist__tablePrice}>
					Price
				</span>
				<span className={style.whitelist__tableAmount}>
					Amount
				</span>
			</div>
			<div className={style.whitelist__entries}>
				{
					products.length > 0
					?
						products.map((product) => {
							return(
								<div className={`${style.whitelist__productEntry} ${style.productEntry}`} key={product.id}>
									<div className={style.productEntry__pictureShell}>
										<img src={product.pictures[0]} alt={product.name} />
									</div>
									<div className={style.productEntry__nameAndIdShell}>
										<h3 className={style.productEntry__name}>
											{product.name}
										</h3>
										<h4 className={style.productEntry__id}>
											Web ID: {product.webId}
										</h4>
									</div>
									<div className={style.productEntry__priceShell}>
										<Price className={style.productEntry__price} price={product.price} oldPrice={product.oldPrice} />
									</div>
									<div className={style.productEntry__addToCartShell}>
										<AddToCart productId={product.id} />
									</div>
									<div className={style.productEntry__deleteButtonShell}>
										<input
											type="button"
											className={style.productEntry__deleteButton}
											onClick={() => dispatch(removeFromWhitelistAction(product.id))}
										/>
									</div>
								</div>
							)
						})
					:
						<p className="text-center">
							Your whitelist is empty
						</p>
				}
			</div>
		</div>
	</div>
	)
}

export default Whitelist;