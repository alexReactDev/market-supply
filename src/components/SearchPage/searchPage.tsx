import { FC, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { loadMoreSearchResultsAction, searchRequestAction } from "../../redux/actions";
import { searchProductsWithPropsSelector, searchSelector, URLLocationSelector, URLPathEndSelector } from "../../redux/selectors";
import Loader from "../Loader";
import Price from "../Price";
import Rate from "../Rate";
import style from "./searchPage.module.scss";

const SearchPage: FC<{}> = () => {

	const search = useAppSelector(searchSelector);
	const searchProducts = useAppSelector(searchProductsWithPropsSelector);
	const query = useAppSelector(URLPathEndSelector);
	const page = +useAppSelector(URLLocationSelector).query.page;
	
	const dispatch = useAppDispatch();

	useEffect(() => {
		if(!search.loaded && !search.loading && !search.error) {
			dispatch(searchRequestAction(query, page));
		}
	}, [search.loaded, search.loading, search.error])

	if(search.error) return <Redirect to="/error" />

	if(!search.loaded) return <Loader />

	return (
		<div className={style.search}>
			<div className={style.search__header}>
				<h2 className={style.search__title}>
					Search
				</h2>
			</div>
			<ul className={style.search__itemsList}>
				{
					searchProducts.length === 0 && search.loaded && !search.loading
					?
					<p className="text-center">
						Nothing found
					</p>
					:
					null
				}
				{
					searchProducts.map((product) => {
						return(
							<li key={product.productId} className={`${style.search__item} ${style.item}`}>
								<div className={style.item__picture}>
									<img className={style.item__img} src={product.pictures[0]} alt={product.name} />
								</div>
								<div className={style.item__info}>
									<h3 className={style.item__name}>
										<Link to={`/product/${product.productId}`} className="nav-link" >
											{product.name}	
										</Link>
									</h3>
									<h4 className={style.item__webId}>
										WebID: {product.webId}
									</h4>
								</div>
								<div className={style.item__rate}>
									<Rate rate={product.rate} />
								</div>
								<div className={style.item__price}>
									<Price price={product.price} oldPrice={product.oldPrice} />
								</div>
							</li>
						)
					})
				}
			</ul>
			{
				search.loading
				?
				<Loader />
				:
				null
			}
			{
				search.loading || search.done
				?
				null
				:
				<div className={style.search__btnShell}>
					<input
						type="button"
						className={`${style.search__btn} btn`}
						value="Load more"
						onClick={() => dispatch(loadMoreSearchResultsAction())}
					/>
				</div>
			}
		</div>
	)
}

export default SearchPage;