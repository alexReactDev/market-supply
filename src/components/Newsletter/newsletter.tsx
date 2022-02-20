import { useFormik } from "formik";
import { FC } from "react";
import { useDispatch } from "react-redux";
import { subscribeToNewsletterAction } from "../../redux/actions";
import style from "./newsletter.module.scss";

interface IProps {
	className?: string
}

const Newsletter: FC<IProps> = ({ className="" }) => {
	
	const dispatch = useDispatch();
	const formik = useFormik({
		initialValues: {
			email: ""
		},
		onSubmit(values) {
			dispatch(subscribeToNewsletterAction(values.email));
		},
		validate(values) {
			return values.email ? {} : {email: "Email shouldn't be empty"};
		}
	})

	return(
		<form onSubmit={formik.handleSubmit} className={`${className} ${style.newsletter}`}>
			<h4 className={style.newsletter__title}>
				Newsletters
			</h4>
			<p className={style.newsletter__text}>
				Sign up for Our Newsletter!
			</p>
			<div className={style.newsletter__inputsField}>
				<input
					type="email"
					className={style.newsletter__input}
					name="email" 
					id="email"
					onChange={formik.handleChange}
					value={formik.values.email}
				/>
			</div>
			<div className={style.newsletter__buttonsField}>
				<input
					type="submit"
					className={`${style.newsletter__button} btn`}
					value="Subscribe"
				/>
			</div>
		</form>
	)
}

export default Newsletter;