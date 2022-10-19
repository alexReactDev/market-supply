import { FC, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { changePreferenceAutoFillAction, loadUserDataAction, loadUserOrdersAction } from "../../redux/actions";
import { loggedInSelector, preferencesSelector, userDataSelector, userOrdersWithProductDataSelector } from "../../redux/selectors";
import CurrencyConverter from "../CurrencyConverter";
import Loader from "../Loader";
import style from "./myAccount.module.scss";
import imgPlaceholder from "../../images/products/placeholder.png";

const MyAccount: FC<{}> = () => {

	const loggedIn = useAppSelector(loggedInSelector);
	const userData = useAppSelector(userDataSelector);
	const orders = useAppSelector(userOrdersWithProductDataSelector);
	const preferences = useAppSelector(preferencesSelector);

	const dispatch = useAppDispatch();

	useEffect(() => {
		if(loggedIn && !userData.loading && !userData.loaded && !userData.error) dispatch(loadUserDataAction());
	}, []);

	useEffect(() => {
		if(loggedIn && orders.orders.length === 0 && !orders.done && !orders.loading && !orders.error) dispatch(loadUserOrdersAction());
	}, [])

	const profileData = userData.userData;

	function changeAutofill() {
		dispatch(changePreferenceAutoFillAction(!preferences.auto_fill));
	}

	if(!loggedIn) return <Redirect to="/login"/>
	
	if((userData.loading) || (!userData.loaded && !userData.error)) return <Loader />

	if(userData.error) return <Redirect to="/error"/>

	return(
		<div className={style.myAccount}>
			<h2 className={style.myAccount__title}>
				My account
			</h2>
			<div className={`${style.myAccount__entry} ${style.userData}`}>
				<div className={style.userData__item}>
					<span className={style.userData__title}>
						Name:
					</span> 
					{profileData.name}
				</div>
				<div className={style.userData__item}>
					<span className={style.userData__title}>
						Surname:
					</span> 
					{profileData.surname}
				</div>
				<div className={style.userData__item}>
					<span className={style.userData__title}>
						Phone:
					</span> 
					{profileData.phone}
				</div>
				<div className={style.userData__item}>
					<span className={style.userData__title}>
						Town:
					</span> 
					{profileData.town}
				</div>
				<div className={style.userData__item}>
					<span className={style.userData__title}>
						Street:
					</span> 
					{profileData.street}
				</div>
				<div className={style.userData__item}>
					<span className={style.userData__title}>
						House/building:
					</span> 
					{profileData.house}
				</div>
				<div className={style.userData__item}>
					<span className={style.userData__title}>
						Apartment:
					</span> 
					{profileData.apartment}
				</div>
				<div className={style.userData__item}>
					<span className={style.userData__title}>
						Zip code:
					</span> 
					{profileData.zip}
				</div>
			</div>
			<div className={`${style.myAccount__entry} ${style.userDataOptions}`}>
				<div className={style.userDataOptions__option}>
					<span>
						Autofill:
					</span>
					<input
						type="checkbox"
						checked={preferences.auto_fill}
						onChange={() => changeAutofill()}
					/>
					<span className={style.hint}>
						<p className={style.hint__text}>
							If autofill enabled, forms like checkout will be automatically fulfilled with data from your profile.
						</p>
					</span>
				</div>
				<div className={style.userDataOptions__option}>
					<Link to="/account/edit-profile">
						<input 
							type="button"
							className={style.myAccount__btn}
							value="Edit"
						/>
					</Link>
				</div>
			</div>
			<div className={`${style.myAccount__entry} ${style.email}`}>
				<p className={style.email__title}>
					Email:
				</p>
				<p className={style.email__value}>
					{profileData.email}
				</p>
			</div>
			<div className={`${style.myAccount__entry} ${style.controls}`}>
				<div className={style.controls__option}>
					<Link to="/account/edit-email">
						<input
							type="button"
							className={style.myAccount__btn}
							value="Change email"
						/>
					</Link>
				</div>
				<div className={style.controls__option}>
					<Link to="/account/edit-password">
						<input
							type="button"
							className={style.myAccount__btn}
							value="Change password"
						/>
					</Link>
				</div>
			</div>
			<h3 className={style.myAccount__title}>
				My orders
			</h3>
			<div className={`${style.myAccount__entry} ${style.orders}`}>
				<div className={style.orders__header}>
					<div className={style.orders__order}>
						Item
					</div>
					<div className={style.orders__amount}>
						Amount
					</div>
					<div className={style.orders__total}>
						Total
					</div>
					<div className={style.orders__deliveryMethod}>
						Delivery Method
					</div>
					<div className={style.orders__paymentMethod}>
						Payment Method
					</div>
				</div>
				{
					orders.error
					?
					<p className="text-center">
						Failed to load orders
					</p>
					:
					orders.orders.map((order) => {
						return(
							<div key={order.id} className={style.orders__item}>
								<div className={`${style.orders__order} ${style.order}`}>
									<a href={`/product/${order.product_id}`} className={style.order__picture}>
										<img className={style.order__img} src={order.picture} alt={order.name} onError={(e: any) => e.target.src = imgPlaceholder} />
									</a>
									<div className={style.order__info}>
										<a href={`/product/${order.product_id}`}  className={style.order__name}>
											{order.name}
										</a>
										<h5 className={style.order__webId}>
											WebId: {order.webId}
										</h5>
									</div>
								</div>
								<div className={style.orders__amount}>
									<span className={style.orders__label}>
										Amount:
									</span>
								 	{order.amount}
								</div>
								<div className={style.orders__total}>
									<span className={style.orders__label}>
										Total:
									</span>
									<CurrencyConverter value={order.total} />
								</div>
								<div className={style.orders__deliveryMethod}>
									<span className={style.orders__label}>
										Delivery method:
									</span>
									{order.delivery_method}
								</div>
								<div className={style.orders__paymentMethod}>
									<span className={style.orders__label}>
										Payment method:
									</span>
									{order.payment_method}
								</div>
							</div>
						)
					})
				}
				{
					!orders.done && !orders.loading
					?
					<div className={style.orders__btnShell}>
						<input
							type="button"
							className={style.myAccount__btn}
							value="Load more"
							onClick={() => dispatch(loadUserOrdersAction())}
						/>
					</div>
					:
					null
				}
				{
					orders.orders.length === 0 && orders.done
					?
					<p className="text-center">
						No orders
					</p>
					:
					null
				}
			</div>
			<div className={`${style.myAccount__entry} ${style.controls}`}>
				<div className={style.controls__option}>
					<Link to="/account/delete">
						<input
							type="button"
							className={style.myAccount__btn}
							value="Delete Account"
						/>
					</Link>
				</div>
			</div>
		</div>
	)
}

export default MyAccount;