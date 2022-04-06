import { cartProductsSelector } from "../../redux/selectors";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { FC } from "react";
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
import { checkoutAction } from "../../redux/actions";

const Checkout: FC<{}> = () => {

	const cartProducts = useSelector(cartProductsSelector);
	const dispatch = useDispatch();

	const formik = useFormik({
		initialValues: {
			name: "",
			surname: "",
			phone: "",
			email: "",
			deliveryMethod: "pickup",
			pickupAddress: "123 Main Road, New York, NY 1234",
			apartmentNumber: "",
			houseNumber: "",
			street: "",
			town: "",
			zipCode: "",
			preferableDate: "",
			paymentMethod: "online",
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

			if(values.deliveryMethod === "delivery") {
				if(!values.houseNumber) errors.houseNumber = "house number required";
				if(!values.street) errors.street = "street required";
				if(!values.town) errors.town = "town required";
				if(!values.zipCode) errors.zipCode = "zip code required";
			}

			return errors;
		}
	});

	if(Object.keys(cartProducts).length === 0) return (
		<p className={style.emptyCart}>
			Your cart is empty now.
			Let's go and buy some stuff.
		</p>
	)

	return (
		<form className={style.checkout} onSubmit={formik.handleSubmit}>
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
							value={formik.values.name}
							onChange={formik.handleChange}
						/>
					</span>
					<span className={style.checkout__field}>
						<input 
							type="text"
							className={`${style.checkout__input} ${formik.errors.surname && formik.touched.surname ? style.checkout__input_invalid : ""}`}
							id="surname"
							name="surname"
							placeholder="Surname"
							value={formik.values.surname}
							onChange={formik.handleChange}
						/>
					</span>
					<span className={style.checkout__field}>
						<input 
							type="phone"
							className={`${style.checkout__input} ${formik.errors.phone && formik.touched.phone ? style.checkout__input_invalid : ""}`}
							id="phone"
							name="phone"
							placeholder="Phone number"
							value={formik.values.phone}
							onChange={formik.handleChange}
						/>
					</span>
					<span className={style.checkout__field}>
						<input 
							type="email"
							className={`${style.checkout__input} ${formik.errors.email && formik.touched.email ? style.checkout__input_invalid : ""}`}
							id="email"
							name="email"
							placeholder="Email"
							value={formik.values.email}
							onChange={formik.handleChange}
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
						className={`${style.checkout__deliveryMethodOption} ${style.deliveryMethodOption} ${formik.values.deliveryMethod === "pickup" ? style.deliveryMethodOption_active : ""}`}
						onClick={() => formik.setFieldValue("deliveryMethod", "pickup")}	
					>
						<p className={`${style.deliveryMethodOption__text} ${style.deliveryMethodOption_pickup}`}>
							Pickup
						</p>
					</span>
					<span 
						className={`${style.checkout__deliveryMethodOption} ${style.deliveryMethodOption} ${formik.values.deliveryMethod === "delivery" ? style.deliveryMethodOption_active : ""}`}
						onClick={() => formik.setFieldValue("deliveryMethod", "delivery")}
					>
						<p className={`${style.deliveryMethodOption__text} ${style.deliveryMethodOption_delivery}`}>
							Delivery
						</p>
					</span>
				</div>
				{
					formik.values.deliveryMethod === "pickup"
					?
					<div className={`${style.checkout__pickup} ${style.pickup}`}>
						<select 
							className={style.pickup__select}
							name="pickupAddress"
							id="pickupAddress"
							value={formik.values.pickupAddress}
							onChange={formik.handleChange}
						>
							<option className={style.pickup__option}>
								123 Main Road, New York, NY 1234
							</option>
							<option className={style.pickup__option}>
								1 Second Road, New York, NY 4321
							</option>
							<option className={style.pickup__option}>
								12 Small Road, New York, NY 8121
							</option>
						</select>
						<div className={style.pickup__shopDetails}>
							<div className={style.pickup__shopInfo}>
								<h4 className={style.pickup__shopName}>
									{formik.values.pickupAddress}
								</h4>
								<p className={style.pickup__shopSchedule}>
									9:00 - 20:00 mon-fri
								</p>
								<p className={style.pickup__shopPhone}>
									+1 (234) 567 89 10
								</p>
								<p className={style.pickup__deliveryDate}>
									Delivery date: 17: 00 6 apr 2022
								</p>
							</div>
							<div className={style.pickup__map}>
								<img src={mapPlaceholder} alt="map" />
							</div>
						</div>
					</div>
					:
					<div className={style.checkout__delivery}>
						<span className={style.checkout__field}>
							<input 
								type="text"
								className={style.checkout__input}
								id="apartmentNumber"
								name="apartmentNumber"
								placeholder="Apartment number (optional)"
								value={formik.values.apartmentNumber}
								onChange={formik.handleChange}
							/>
						</span>
						<span className={style.checkout__field}>
							<input 
								type="text"
								className={`${style.checkout__input} ${formik.errors.houseNumber && formik.touched.houseNumber ? style.checkout__input_invalid : ""}`}
								id="houseNumber"
								name="houseNumber"
								placeholder="House/Building number"
								value={formik.values.houseNumber}
								onChange={formik.handleChange}
							/>
						</span>
						<span className={style.checkout__field}>
							<input 
								type="text"
								className={`${style.checkout__input} ${formik.errors.street && formik.touched.street ? style.checkout__input_invalid : ""}`}
								id="street"
								name="street"
								placeholder="Street"
								value={formik.values.street}
								onChange={formik.handleChange}
							/>
						</span>
						<span className={style.checkout__field}>
							<input 
								type="text"
								className={`${style.checkout__input} ${formik.errors.town && formik.touched.town ? style.checkout__input_invalid : ""}`}
								id="town"
								name="town"
								placeholder="Town"
								value={formik.values.town}
								onChange={formik.handleChange}
							/>
						</span>
						<span className={style.checkout__field}>
							<input 
								type="text"
								className={`${style.checkout__input} ${formik.errors.zipCode && formik.touched.zipCode ? style.checkout__input_invalid : ""}`}
								id="zipCode"
								name="zipCode"
								placeholder="Zip code"
								value={formik.values.zipCode}
								onChange={formik.handleChange}
							/>
						</span>
						<span className={style.checkout__field}>
							<input 
								type="date"
								className={style.checkout__input}
								id="preferableDate"
								name="preferableDate"
								placeholder="Preferable delivery date"
								value={formik.values.preferableDate}
								onChange={formik.handleChange}
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
							className={`${style.payment__method} ${formik.values.paymentMethod === "onReceive" ? style.payment__method_active : ""}`}
							onClick={() => formik.setFieldValue("paymentMethod", "onReceive")}
						>
							<p className={style.payment__methodText}>
								On receive
							</p>
						</span>
						<span 
							className={`${style.payment__method} ${formik.values.paymentMethod === "online" ? style.payment__method_active : ""}`}
							onClick={() => formik.setFieldValue("paymentMethod", "online")}
						>
							<p className={style.payment__methodText}>
								Online
							</p>
						</span>
					</div>
					{
						formik.values.paymentMethod === "online"
						?
						<ul className={style.payment__options}>
							<li 
								className={`${style.payment__option} ${formik.values.onlinePaymentOption === "card" ? style.payment__option_active : ""}`}
								onClick={() => formik.setFieldValue("onlinePaymentOption", "card")}
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
								onClick={() => formik.setFieldValue("onlinePaymentOption", "paypal")}
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
								onClick={() => formik.setFieldValue("onlinePaymentOption", "bitcoin")}
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
					className={`${style.checkout__submitBtn} btn`}
					value="Submit"
				/>
			</div>
		</form>
	)
}

export default Checkout;