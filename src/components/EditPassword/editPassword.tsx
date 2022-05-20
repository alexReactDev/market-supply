import { useFormik } from "formik";
import { FC } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { editPasswordAction } from "../../redux/actions";
import { editPasswordDataSelector } from "../../redux/selectors";
import Loader from "../Loader";
import style from "./editPassword.module.scss";

const EditPassword: FC<{}> = () => {

	const data = useAppSelector(editPasswordDataSelector);

	const dispatch = useAppDispatch();

	const formik = useFormik({
		initialValues: {
			oldPassword: "",
			newPassword: "",
			repeatPassword: ""
		},
		onSubmit(values) {
			const {repeatPassword, ...data} = values;

			dispatch(editPasswordAction(data));
		},
		validate(values) {
			const errors: any = {};

			if(!values.oldPassword) errors.oldPassword = "Confirm your old password";
			if(!values.newPassword) errors.newPassword = "Enter new password";
			if(!values.repeatPassword) errors.repeatPassword = "Repeat your password";
			if(values.newPassword !== values.repeatPassword) errors.repeatPassword = "Passwords do not match";

			return errors;
		}
	})

	return(
		<div className={style.editPassword}>
			<h2 className={style.editPassword__title}>
				Edit password
			</h2>
			{
				data.loading
				?
				<Loader />
				:
				null
			}
			{
				formik.errors.repeatPassword && formik.touched.repeatPassword
				?
				<p className={style.editPassword__errorMessage}>
					{formik.errors.repeatPassword}
				</p>
				:
				data.error
				?
				<p className={style.editEmail__errorMessage}>
					{data.error}
				</p>
				:
				null
			}
			<form className={`${style.editPassword__form} ${style.form}`} onSubmit={formik.handleSubmit} >
				<div className={style.form__fields}>
					<div className={style.form__field}>
						<input
							type="password"
							className={style.form__input}
							id="newPassword"
							name="newPassword"
							placeholder="New password"
							value={formik.values.newPassword}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
					</div>
					<div className={style.form__field}>
						<input
							type="password"
							className={style.form__input}
							id="repeatPassword"
							name="repeatPassword"
							placeholder="Repeat password"
							value={formik.values.repeatPassword}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
					</div>
					<div className={style.form__field}>
						<input
							type="password"
							className={style.form__input}
							id="oldPassword"
							name="oldPassword"
							placeholder="Confirm your old password"
							value={formik.values.oldPassword}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
					</div>
				</div>
				<div className={style.form__controls}>
					<div className={style.form__control}>
						<input
							type="submit"
							className={style.editPassword__btn}
							value="Confirm"
						/>
					</div>
				</div>
			</form>
		</div>
	)
}

export default EditPassword;