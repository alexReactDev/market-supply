import { FC, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { changePreferencesAction, loadUserDataAction, loadUserOrdersAction } from "../../redux/actions";
import { loggedInSelector, preferencesSelector, userDataSelector, userOrdersWithProductDataSelector } from "../../redux/selectors";
import CurrencyConverter from "../CurrencyConverter";
import Loader from "../Loader";
import style from "./myAccount.module.scss";

const MyAccount: FC<{}> = () => {

	const loggedIn = useAppSelector(loggedInSelector);
	const userData = useAppSelector(userDataSelector);
	const orders = useAppSelector(userOrdersWithProductDataSelector);
	const preferences = useAppSelector(preferencesSelector);

	const dispatch = useAppDispatch();

	useEffect(() => {
		if(!userData.loading && !userData.loaded && !userData.error) dispatch(loadUserDataAction());
	}, []);

	useEffect(() => {
		if(orders.orders.length === 0 && !orders.done && !orders.loading && !orders.error) dispatch(loadUserOrdersAction());
	}, [])

	const profileData = userData.userData;

	function changeAutofill() {
		dispatch(changePreferencesAction({
			autoFill: !preferences.autoFill
		}))
	}

	if(!loggedIn) return <Redirect to="/login"/>
	
	if(userData.loading) return <Loader />

	if(!userData.loading && !userData.loaded && !userData.error) return <Loader />

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
						checked={preferences.autoFill}
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
					orders.loading
					?
					<Loader />
					:
					orders.orders.map((order) => {
						return(
							<div key={order.webId} className={style.orders__item}>
								<div className={`${style.orders__order} ${style.order}`}>
									<div className={style.order__picture}>
										<img className={style.order__img} src={order.picture} alt={order.name} />
									</div>
									<div className={style.order__info}>
										<h4 className={style.order__name}>
											{order.name}
										</h4>
										<h5 className={style.order__webId}>
											WebId: {order.webId}
										</h5>
									</div>
								</div>
								<div className={style.orders__amount}>
									{order.amount}
								</div>
								<div className={style.orders__total}>
									<CurrencyConverter value={order.total} />
								</div>
								<div className={style.orders__deliveryMethod}>
									{order.deliveryMethod}
								</div>
								<div className={style.orders__paymentMethod}>
									{order.paymentMethod}
								</div>
							</div>
						)
					})
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