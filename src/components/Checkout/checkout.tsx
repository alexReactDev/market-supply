import { useFormik } from "formik";
import { FC } from "react";
import style from "./checkout.module.scss";

import mapPlaceholder from "../../images/map/map.jpg";
import { useSelector } from "react-redux";
import { cartProductsSelector } from "../../redux/selectors";

const Checkout: FC<{}> = () => {

	const cartProducts = useSelector(cartProductsSelector);

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
			<fieldset className={style.checkout__fieldset}>
				<h3 className={style.checkout__title}>
					User data
				</h3>
				<div className={style.checkout__userData}>
					<span className={style.checkout__field}>
						<input 
							type="text"
							className={style.checkout__input}
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
							className={style.checkout__input}
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
							className={style.checkout__input}
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
							className={style.checkout__input}
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
								className={style.checkout__input}
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
								className={style.checkout__input}
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
								className={style.checkout__input}
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
								className={style.checkout__input}
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
								</p>
							</li>
							<li 
								className={`${style.payment__option} ${formik.values.onlinePaymentOption === "paypal" ? style.payment__option_active : ""}`}
								onClick={() => formik.setFieldValue("onlinePaymentOption", "paypal")}
							>
								<p className={style.payment__optionText}>
									Paypal
								</p>
							</li>
							<li 
								className={`${style.payment__option} ${formik.values.onlinePaymentOption === "bitcoin" ? style.payment__option_active : ""}`}
								onClick={() => formik.setFieldValue("onlinePaymentOption", "bitcoin")}
							>
								<p className={style.payment__optionText}>
									Bitcoin
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