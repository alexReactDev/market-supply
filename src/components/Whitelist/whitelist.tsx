import { FC, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { useAppSelector } from "../../hooks";
import { clearWishlistAction, loadWishlistProductsAction, removeFromWhitelistAction } from "../../redux/actions";
import { whitelistProductsWithPropsSelector, wishlistSelector } from "../../redux/selectors";
import AddToCart from "../AddToCart";
import Loader from "../Loader";
import Price from "../Price";
import style from "./whitelist.module.scss";

const Whitelist: FC<{}> = () => {

	const wishlist = useAppSelector(wishlistSelector);
	const products = useSelector(whitelistProductsWithPropsSelector);
	const dispatch = useDispatch();

	useEffect(() => {
		if(!wishlist.loaded && !wishlist.loading && !wishlist.error) dispatch(loadWishlistProductsAction());
	}, [])

	if((!wishlist.loaded && !wishlist.error) || wishlist.loading) return <Loader />

	if(wishlist.error) return <Redirect to="/error" />

	return(
	<div className={style.whitelist}>
		<h2 className={style.whitelist__title}>
			Wishlist
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
							Your wishlist is empty
						</p>
				}
			</div>
		</div>
		<div className={style.wishlist__controls}>
			{
				products.length > 0
				?
				<span className={style.wishlist__btnShell}>
					<input
						type="button"
						className={`${style.wishlist__btn} btn`}
						value="Clear"
						onClick={() => dispatch(clearWishlistAction())}
					/>
				</span>
				:
				null
			}
			
		</div>
	</div>
	)
}

export default Whitelist;