import { FormikErrors, useFormik } from "formik";
import { FC } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { editEmailAction } from "../../redux/actions";
import { editEmailDataSelector } from "../../redux/selectors";
import Loader from "../Loader";
import style from "./editEmail.module.scss";

const EditEmail: FC<{}> = () => {

	const data = useAppSelector(editEmailDataSelector);
	
	const dispatch = useAppDispatch();

	const formik = useFormik({
		initialValues: {
			email: "",
			password: ""
		},
		onSubmit(values) {
			dispatch(editEmailAction(values));
		},
		validate(values) {
			const errors: any = {};

			if(!values.email) errors.email = "Enter new email";
			if(!values.password) errors.password = "Confirm your password";

			return errors;
		}
	})

	return(
		<div className={style.editEmail}>
			<h2 className={style.editEmail__title}>
				Edit email
			</h2>
			{
				data.loading
				?
				<Loader />
				:
				null
			}
			{
				data.error
				?
				<p className={style.editEmail__errorMessage}>
					{data.error}
				</p>
				:
				null
			}
			<form className={`${style.editEmail__item} ${style.editEmail__form}`} onSubmit={formik.handleSubmit} >
				<div className={style.form__fields}>
					<div className={style.form__field}>
						<input
							type="email"
							className={style.form__input}
							id="email"
							name="email"
							placeholder="New email"
							value={formik.values.email}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
					</div>
					<div className={style.form__field}>
						<input
							type="password"
							className={style.form__input}
							id="password"
							name="password"
							placeholder="Confirm your password"
							value={formik.values.password}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
					</div>
				</div>
				<div className={style.form__controls}>
					<div className={style.form__control}>
						<input
							type="submit"
							className={style.editEmail__btn}
							value="Confirm"
						/>
					</div>
				</div>
			</form>
		</div>
	)
}

export default EditEmail;