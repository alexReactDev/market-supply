import { FC } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../../hooks";
import { emptyCartAction, productDecrementAction, productIncrementAction, removeProductAction } from "../../redux/actions";
import { cartTotal, IProductWithProps } from "../../redux/selectors";
import { cartProductsWithPropsSelector } from "../../redux/selectors";
import CurrencyConverter from "../CurrencyConverter";
import Price from "../Price";
import style from "./cart.module.scss";

const Cart: FC<{}> = () => {

	const products = useSelector(cartProductsWithPropsSelector) as IProductWithProps[];
	const total = useSelector(cartTotal);
	const dispatch = useAppDispatch();

	return(
		<div className={style.cart}>
			<h2 className={style.cart__title}>
				Cart
			</h2>
			<div className={style.cart__table}>
				<div className={style.cart__tableHeader}>
					<span className={style.cart__tableItem}>
						Item
					</span>
					<span className={style.cart__tablePrice}>
						Price
					</span>
					<span className={style.cart__tableAmount}>
						Amount
					</span>
					<span className={style.cart__tableTotal}>
						Total
					</span>
				</div>
				<div className={style.cart__entries}>
					{
						products.length > 0
						?
							products.map((product) => {
								return(
									<div className={`${style.cart__productEntry} ${style.productEntry}`} key={product.id}>
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
										<div className={style.productEntry__amountShell}>
											<input 
												type="button"
												className={style.productEntry__amountDecrement}
												onClick={() => dispatch(productDecrementAction(product.id))}
											/>
											<span className={style.productEntry__amount}>
												{product.amount}
											</span>
											<input
												type="button"
												className={style.productEntry__amountIncrement}
												onClick={() => dispatch(productIncrementAction(product.id))}
											/>
										</div>
										<div className={style.productEntry__totalShell}>
											<span className={style.productEntry__total}>
												<CurrencyConverter value={product.total} />
											</span>
										</div>
										<div className={style.productEntry__deleteButtonShell}>
											<input
												type="button"
												className={style.productEntry__deleteButton}
												onClick={() => dispatch(removeProductAction(product.id))}
											/>
										</div>
									</div>
								)
							})
						:
							<p className="text-center">
								Your cart is empty
							</p>
					}
				</div>
				<div className={style.cart__totalField}>
					<p className={style.cart__total}>
						Total: <CurrencyConverter value={total} />
					</p>
				</div>
			</div>
			{
				products.length > 0
				?
				<div className={style.cart__buttonsField}>
					<span className={style.cart__btnShell}>
						<input	
							type="button"
							className={`${style.cart__btn} btn`}
							value="Clear"
							onClick={() => dispatch(emptyCartAction())}
						/>
					</span>
					<Link to="/checkout" className={`${style.cart__btnShell} nav-link`}>
						<input
							type="button"
							className={`${style.cart__btn} btn`}
							value="Go to checkout"
						/>
					</Link>
				</div>
				:
				null
			}

		</div>
	)
}

export default Cart;