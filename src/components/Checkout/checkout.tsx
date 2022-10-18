
import { cartProductsSelector, checkoutConfirmationDataProductsWithPropsSelector, checkoutConfirmationDataSelector, checkoutSelector, loggedInSelector, outletsSelector, preferencesSelector, userDataSelector } from "../../redux/selectors";
import { cancelCheckoutConfirmationAction, checkoutAction, confirmCheckoutAction, loadOutletsAction, loadUserDataAction } from "../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { FC, useEffect } from "react";
import style from "./checkout.module.scss";

import mapPlaceholder from "../../images/map/map.jpg";
import bankCard0 from "../../images/payment-methods/0.png";
import bankCard1 from "../../images/payment-methods/1.png";
import bankCard2 from "../../images/payment-methods/2.png";
import bankCard3 from "../../images/payment-methods/3.png";
import bankCard4 from "../../images/payment-methods/4.png";
import bankCard5 from "../../images/payment-methods/5.png";
import bankCard6 from "../../images/payment-methods/6.png";
import paypalIcon from "../../images/icons/paypal.png";
import bitcoinIcon from "../../images/icons/bitcoin.png";
import Loader from "../Loader";
import CurrencyConverter from "../CurrencyConverter";
import { useAppSelector } from "../../hooks";

const Checkout: FC<{}> = () => {

	const cartProducts = useSelector(cartProductsSelector);
	const checkoutData = useSelector(checkoutSelector);
	const confirmData = useSelector(checkoutConfirmationDataSelector);
	const confirmDataProducts = useSelector(checkoutConfirmationDataProductsWithPropsSelector);
	const userData = useAppSelector(userDataSelector);
	const profileData = userData.userData;
	const preferences = useAppSelector(preferencesSelector);
	const loggedIn = useAppSelector(loggedInSelector);
	const outlets = useAppSelector(outletsSelector);

	const dispatch = useDispatch();

	useEffect(() => {
		if(confirmData && confirmDataProducts) {
			document.body.classList.add("body_locked");
			return () => document.body.classList.remove("body_locked");
		}
	}, [confirmData, confirmDataProducts]);

	useEffect(() => {
		if(
			loggedIn 
			&& preferences.auto_fill 
			&& !profileData.loaded 
			&& !profileData.loading 
			&& !profileData.error
		) {
			dispatch(loadUserDataAction());
		}
	}, [loggedIn, preferences, profileData]);

	useEffect(() => {
		if(
			loggedIn
			&& preferences.auto_fill
			&& userData.loaded
		) {
			if(!formik.touched.name) formik.setFieldValue("name", profileData.name);
			if(!formik.touched.surname) formik.setFieldValue("surname", profileData.surname);
			if(!formik.touched.phone) formik.setFieldValue("phone", profileData.phone);
			if(!formik.touched.email) formik.setFieldValue("email", profileData.email);
			if(!formik.touched.apartment_no) formik.setFieldValue("apartment_no", profileData.apartment);
			if(!formik.touched.house) formik.setFieldValue("house", profileData.house);
			if(!formik.touched.street) formik.setFieldValue("street", profileData.street);
			if(!formik.touched.town) formik.setFieldValue("town", profileData.town);
			if(!formik.touched.zip) formik.setFieldValue("zip", profileData.zip);
		}
	}, [userData.loaded, preferences.auto_fill, loggedIn]);

	useEffect(() => () => {
			dispatch(cancelCheckoutConfirmationAction());
	}, []);

	useEffect(() => {
		if(!outlets.loaded && !outlets.loading && !outlets.error) dispatch(loadOutletsAction());
	}, [outlets]);

	const formik = useFormik({
		initialValues: {
			name: "",
			surname: "",
			phone: "",
			email: "",
			outlet_id: "1",
			delivery_method: "pickup",
			apartment_no: "",
			house: "",
			street: "",
			town: "",
			zip: "",
			preferableDate: "",
			payment_method: "online",
			onlinePaymentOption: "card"
		},
		onSubmit(values) {
			dispatch(checkoutAction(values));
		},
		validate(values) {
			const errors: any = {};

			if(!values.name) errors.name = "name required";
			if(!values.surname) errors.surname = "surname required";
			if(!values.phone) errors.phone = "phone required";
			if(!values.email) errors.email = "email required";

			if(values.delivery_method === "delivery") {
				if(!values.house) errors.house = "house number required";
				if(!values.street) errors.street = "street required";
				if(!values.town) errors.town = "town required";
				if(!values.zip) errors.zip = "zip code required";
			}

			return errors;
		}
	});

	const pickedOutlet = outlets.outlets.find((outlet) => outlet.id + "" === formik.values.outlet_id);

	if(Object.keys(cartProducts).length === 0) return (
		<p className={style.emptyCart}>
			Your cart is empty now.
			Let's go and buy some stuff.
		</p>
	)

	return (
		<form className={style.checkout} onSubmit={formik.handleSubmit}>
			{
				confirmData && confirmDataProducts
				?
				<div className={`${style.checkout__modal} ${style.modal}`}>
					<div className={style.modal__body}>
						<h2 className={style.modal__title}>
							Check your order data
						</h2>
						<ul className={style.modal__list}>
							<li className={`${style.modal__listHeader} ${style.item}`}>
								<div className={style.item__item}>
									Item
								</div>
								<div className={style.item__amount}>
									Amount
								</div>
								<div className={style.item__total}>
									Total
								</div>	
							</li>
							{
								confirmDataProducts.map((item) => {
									return(
										<li key={item.product_id} className={`${style.modal__listItem} ${style.item}`}>
											<div className={style.item__picture}>
												<img className={style.item__img} src={item.img} alt={item.name} />
											</div>
											<div className={style.item__data}>
												<h4 className={style.item__name}>
													{item.name}
												</h4>
												<h5 className={style.item__webId}>
													Web ID: {item.webId}
												</h5>
											</div>
											<div className={style.item__amount}>
												<span className={style.item__label}>
													Amount:
												</span>
												{item.amount}
											</div>
											<div className={style.item__total}>
												<span className={style.item__label}>
													Total:
												</span>
												<CurrencyConverter value={item.total} />
											</div>
										</li>
									)
								})
							}
						</ul>
						<div className={`${style.modal__entry} ${style.entry}`}>
							<p className={style.entry__name}>
								Delivery method:
							</p>
							<p className={style.entry__value}>
								{confirmData.delivery_method}
							</p>
						</div>
						<div className={`${style.modal__entry} ${style.entry}`}>
							<p className={style.entry__name}>
								Payment method:
							</p>
							<p className={style.entry__value}>
								{confirmData.payment_method}
							</p>
						</div>
						<div className={`${style.modal__entry} ${style.entry}`}>
							<p className={style.entry__name}>
								Total:
							</p>
							<p className={style.entry__value}>
								<CurrencyConverter value={confirmData.total} />
							</p>
						</div>
						<div className={style.modal__controls}>
							<div className={style.modal__control}>
								<input
									type="button"
									className={`${style.checkout__btn} btn`}
									value="Cancel"
									onClick={() => dispatch(cancelCheckoutConfirmationAction())}
								/>
							</div>
							<div className={style.modal__control}>
								<input
									type="button"
									className={`${style.checkout__btn} btn`}
									value="Confirm"
									onClick={() => dispatch(confirmCheckoutAction())}
								/>
							</div>
						</div>
					</div>
				</div>
				:
				null
			}
			{
				Object.values(formik.errors).filter((val) => val !== "").length > 0
				&& Object.values(formik.touched).find((val) => val)
				?
				<div className={style.checkout__errors}>
					<p className={style.checkout__errorMessage}>
						Some invalid values
					</p>
				</div>
				:
				checkoutData.error
				?
				<div className={style.checkout__errors}>
					<p className={style.checkout__errorMessage}>
						{checkoutData.error}
					</p>
				</div>
				:
				null
			}
			{
				checkoutData.loading
				?
				<Loader />
				:
				null
			}
			<fieldset className={style.checkout__fieldset}>
				<h3 className={style.checkout__title}>
					User data
				</h3>
				<div className={style.checkout__userData}>
					<span className={style.checkout__field}>
						<input 
							type="text"
							className={`${style.checkout__input} ${formik.errors.name && formik.touched.name ? style.checkout__input_invalid : ""}`}
							id="name"
							name="name"
							placeholder="Name"
							disabled={checkoutData.loading}
							value={formik.values.name}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
					</span>
					<span className={style.checkout__field}>
						<input 
							type="text"
							className={`${style.checkout__input} ${formik.errors.surname && formik.touched.surname ? style.checkout__input_invalid : ""}`}
							id="surname"
							name="surname"
							placeholder="Surname"
							disabled={checkoutData.loading}
							value={formik.values.surname}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
					</span>
					<span className={style.checkout__field}>
						<input 
							type="phone"
							className={`${style.checkout__input} ${formik.errors.phone && formik.touched.phone ? style.checkout__input_invalid : ""}`}
							id="phone"
							name="phone"
							placeholder="Phone number"
							disabled={checkoutData.loading}
							value={formik.values.phone}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
					</span>
					<span className={style.checkout__field}>
						<input 
							type="email"
							className={`${style.checkout__input} ${formik.errors.email && formik.touched.email ? style.checkout__input_invalid : ""}`}
							id="email"
							name="email"
							placeholder="Email"
							disabled={checkoutData.loading}
							value={formik.values.email}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
					</span>
				</div>
			</fieldset>
			<fieldset className={style.checkout__fieldset}>
				<h3 className={style.checkout__title}>
					Delivery method
				</h3>
				<div className={style.checkout__deliveryMethod}>
					<span 
						className={`${style.checkout__deliveryMethodOption} ${style.deliveryMethodOption} ${formik.values.delivery_method === "pickup" ? style.deliveryMethodOption_active : ""}`}
						onClick={() => checkoutData.loading ? null : formik.setFieldValue("delivery_method", "pickup")}	
					>
						<p className={`${style.deliveryMethodOption__text} ${style.deliveryMethodOption_pickup}`}>
							Pickup
						</p>
					</span>
					<span 
						className={`${style.checkout__deliveryMethodOption} ${style.deliveryMethodOption} ${formik.values.delivery_method === "delivery" ? style.deliveryMethodOption_active : ""}`}
						onClick={() => checkoutData.loading ? null : formik.setFieldValue("delivery_method", "delivery")}
					>
						<p className={`${style.deliveryMethodOption__text} ${style.deliveryMethodOption_delivery}`}>
							Delivery
						</p>
					</span>
				</div>
				{
					formik.values.delivery_method === "pickup"
					?
					outlets.loaded
					?
					<div className={`${style.checkout__pickup} ${style.pickup}`}>
						<select 
							className={style.pickup__select}
							name="outlet_id"
							id="outlet_id"
							disabled={checkoutData.loading}
							value={formik.values.outlet_id}
							onChange={formik.handleChange}
						>
							{
								outlets.outlets.map((outlet) => {
									return (
										<option key={outlet.id} value={outlet.id} className={style.pickup__option}>
											{outlet.address}
										</option>
									)
								})
							}
						</select>
						<div className={style.pickup__shopDetails}>
							<div className={style.pickup__shopInfo}>
								<h4 className={style.pickup__shopName}>
									{pickedOutlet?.address}
								</h4>
								<p className={style.pickup__shopSchedule}>
									{pickedOutlet?.schedule}
								</p>
								<p className={style.pickup__shopPhone}>
									{pickedOutlet?.phone}
								</p>
							</div>
							<div className={style.pickup__map}>
								<img src={mapPlaceholder} alt="map" />
							</div>
						</div>
					</div>
					:
					outlets.loading || (!outlets.loaded && !outlets.error)
					?
					<Loader />
					:
					<div className={style.checkout__errors}>
						<p className={style.checkout__errorMessage}>
							Sorry, this way of delivery is unavailable now
						</p>	
					</div>
					:
					<div className={style.checkout__delivery}>
						<span className={style.checkout__field}>
							<input 
								type="text"
								className={style.checkout__input}
								id="apartment_no"
								name="apartment_no"
								placeholder="Apartment number (optional)"
								disabled={checkoutData.loading}
								value={formik.values.apartment_no}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>
						</span>
						<span className={style.checkout__field}>
							<input 
								type="text"
								className={`${style.checkout__input} ${formik.errors.house && formik.touched.house ? style.checkout__input_invalid : ""}`}
								id="house"
								name="house"
								placeholder="House/Building number"
								disabled={checkoutData.loading}
								value={formik.values.house}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>
						</span>
						<span className={style.checkout__field}>
							<input 
								type="text"
								className={`${style.checkout__input} ${formik.errors.street && formik.touched.street ? style.checkout__input_invalid : ""}`}
								id="street"
								name="street"
								placeholder="Street"
								disabled={checkoutData.loading}
								value={formik.values.street}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>
						</span>
						<span className={style.checkout__field}>
							<input 
								type="text"
								className={`${style.checkout__input} ${formik.errors.town && formik.touched.town ? style.checkout__input_invalid : ""}`}
								id="town"
								name="town"
								placeholder="Town"
								disabled={checkoutData.loading}
								value={formik.values.town}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>
						</span>
						<span className={style.checkout__field}>
							<input 
								type="text"
								className={`${style.checkout__input} ${formik.errors.zip && formik.touched.zip ? style.checkout__input_invalid : ""}`}
								id="zip"
								name="zip"
								placeholder="Zip code"
								disabled={checkoutData.loading}
								value={formik.values.zip}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>
						</span>
						<span className={style.checkout__field}>
							<input 
								type="date"
								className={style.checkout__input}
								id="preferableDate"
								name="preferableDate"
								placeholder="Preferable delivery date"
								disabled={checkoutData.loading}
								value={formik.values.preferableDate}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>
						</span>
					</div>
				}
			</fieldset>
			<fieldset className={style.checkout__fieldset}>
				<h3 className={style.checkout__title}>
					Payment method
				</h3>
				<div className={`${style.checkout__payment} ${style.payment}`}>
					<div className={style.payment__methods}>
						<span 
							className={`${style.payment__method} ${formik.values.payment_method === "onReceive" ? style.payment__method_active : ""}`}
							onClick={() => checkoutData.loading ? null : formik.setFieldValue("payment_method", "onReceive")}
						>
							<p className={style.payment__methodText}>
								On receive
							</p>
						</span>
						<span 
							className={`${style.payment__method} ${formik.values.payment_method === "online" ? style.payment__method_active : ""}`}
							onClick={() => checkoutData.loading ? null : formik.setFieldValue("payment_method", "online")}
						>
							<p className={style.payment__methodText}>
								Online
							</p>
						</span>
					</div>
					{
						formik.values.payment_method === "online"
						?
						<ul className={style.payment__options}>
							<li 
								className={`${style.payment__option} ${formik.values.onlinePaymentOption === "card" ? style.payment__option_active : ""}`}
								onClick={() => checkoutData.loading ? null : formik.setFieldValue("onlinePaymentOption", "card")}
							>
								<p className={style.payment__optionText}>
									Bank card
									<span className={style.payment__optionIcon}>
										<img src={bankCard0} alt="stripe" />
									</span>
									<span className={style.payment__optionIcon}>
										<img src={bankCard1} alt="card" />
									</span>
									<span className={style.payment__optionIcon}>
										<img src={bankCard2} alt="JCB" />
									</span>
									<span className={style.payment__optionIcon}>
										<img src={bankCard3} alt="mastercard" />
									</span>
									<span className={style.payment__optionIcon}>
										<img src={bankCard4} alt="DISCOVER" />
									</span>
									<span className={style.payment__optionIcon}>
										<img src={bankCard5} alt="American Express" />
									</span>
									<span className={style.payment__optionIcon}>
										<img src={bankCard6} alt="VISA" />
									</span>
								</p>
							</li>
							<li 
								className={`${style.payment__option} ${formik.values.onlinePaymentOption === "paypal" ? style.payment__option_active : ""}`}
								onClick={() => checkoutData.loading ? null : formik.setFieldValue("onlinePaymentOption", "paypal")}
							>
								<p className={style.payment__optionText}>
									Paypal
									<span className={style.payment__optionIcon}>
										<img src={paypalIcon} alt="paypal" />
									</span>
								</p>
							</li>
							<li 
								className={`${style.payment__option} ${formik.values.onlinePaymentOption === "bitcoin" ? style.payment__option_active : ""}`}
								onClick={() => checkoutData.loading ? null : formik.setFieldValue("onlinePaymentOption", "bitcoin")}
							>
								<p className={style.payment__optionText}>
									Bitcoin
									<span className={style.payment__optionIcon}>
										<img src={bitcoinIcon} alt="bitcoin" />
									</span>
								</p>
							</li>
						</ul>
						:
						null
					}
				</div>
			</fieldset>
			<div className={style.checkout__basement}>
				<input
					type="submit"
					className={`${style.checkout__btn} btn`}
					disabled={checkoutData.loading}
					value="Submit"
				/>
			</div>
		</form>
	)
}

export default Checkout;