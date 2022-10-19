import { FormikValues, useFormik } from "formik";
import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { loadUserDataAction, publishReviewAction } from "../../redux/actions";
import { loggedInSelector, preferencesSelector, userDataSelector } from "../../redux/selectors";
import SetRate from "../SetRate";
import style from "./publishReview.module.scss";

interface IProps {
	className?: string,
	productId: string
}

const PublishReview: FC<IProps> = ({ className="", productId }) => {

	const userData = useAppSelector(userDataSelector);
	const profileData = userData.userData;
	const preferences = useAppSelector(preferencesSelector);
	const loggedIn = useAppSelector(loggedInSelector);

	const dispatch = useAppDispatch();

	const [rateError, setRateError] = useState("");

	useEffect(() => {
		if(
			loggedIn 
			&& preferences.auto_fill 
			&& !userData.loaded 
			&& !userData.loading 
			&& !userData.error
		) {
			dispatch(loadUserDataAction());
		}
	}, [loggedIn, preferences, userData]);

	useEffect(() => {
		if(
			loggedIn
			&& preferences.auto_fill
			&& userData.loaded
		) {
			if(!formik.touched.name) formik.setFieldValue("name", profileData.name);
			if(!formik.touched.email) formik.setFieldValue("email", profileData.email);
		}
	}, [userData.loaded, preferences.auto_fill, loggedIn]);

	const formik = useFormik({
		initialValues: {
			name: "",
			email: "",
			text: "",
			rate: 0
		},
		onSubmit(values) {
			if(values.rate === 0) {
				setRateError("Rate required");
				return;
			}

			dispatch(publishReviewAction(productId, {
				...values,
				title: values.name,
				timestamp: new Date().getTime()
			}));

			formik.resetForm();
		},
		validate(values) {
			const errors = {} as FormikValues;

			if(!values.name) errors.name = "Name required";

			if(!values.email) errors.email = "Email required";

			if(!values.text) errors.text = "Review text required";

			return errors;
		}
	})

	return(
		<form className={`${className} ${style.publishReview}`} onSubmit={formik.handleSubmit}>
			<div className={style.publishReview__contacts}>
				<span className={style.publishReview__name}>
					{
						formik.errors.name && formik.touched.name
						?
						<p className={style.publishReview__validError}>
							{formik.errors.name}
						</p>
						: 
						null
					}
					<input
						type="text"
						placeholder="Your name"
						id="name"
						name="name"
						value={formik.values.name}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						onFocus={() => formik.setFieldError("name", "")}
					/>
				</span>
				<span className={style.publishReview__email}>
				{
						formik.errors.email && formik.touched.email
						?
						<p className={style.publishReview__validError}>
							{formik.errors.email}
						</p>
						: 
						null
					}
					<input
						type="email"
						placeholder="Your email"
						id="email"
						name="email"
						value={formik.values.email}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						onFocus={() => formik.setFieldError("email", "")}
					/>
				</span>
			</div>
			<div className={style.publishReview__text}>
				{
					formik.errors.text && formik.touched.text
					?
					<p className={style.publishReview__validError}>
						{formik.errors.text}
					</p>
					: 
					null
				}
				<textarea 
					placeholder="Write your review"
					id="text"
					name="text"
					value={formik.values.text}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					onFocus={() => formik.setFieldError("text", "")}
				></textarea>
			</div>
			<div className={style.publishReview__controls}>
				{
					rateError
					?
					<p className={style.publishReview__validError}>
						{rateError}
					</p>
					: 
					null
				}
				<SetRate onRate={(r) => {formik.setFieldValue("rate", r); setRateError("")}} rate={formik.values.rate} />
				<span className={style.publishReview__submit}>
					<input
						type="submit"
						value="Send"
					/>
				</span>
			</div>
		</form>
	)
}

export default PublishReview;