import { FormikValues, useFormik } from "formik";
import { FC, useState } from "react";
import { useAppDispatch } from "../../hooks";
import { publishReviewAction } from "../../redux/actions";
import SetRate from "../SetRate";
import style from "./publishReview.module.scss";

interface IProps {
	className?: string,
	productId: string
}

const PublishReview: FC<IProps> = ({ className="", productId }) => {

	const dispatch = useAppDispatch();

	const [rate, changeRate] = useState(0);
	const [rateError, setRateError] = useState("");

	const formik = useFormik({
		initialValues: {
			name: "",
			email: "",
			text: ""
		},
		onSubmit(values) {
			if(rate === 0) {
				setRateError("Rate required");
				return;
			}

			dispatch(publishReviewAction(productId, {
				...values,
				title: values.name,
				rate,
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
				<SetRate onRate={(r) => {changeRate(r); setRateError("")}} />
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