import { useFormik } from "formik";
import { FC, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { deleteAccountAction } from "../../redux/actions";
import { deleteAccountDataSelector } from "../../redux/selectors";
import Loader from "../Loader";
import style from "./deleteAccount.module.scss";

const DeleteAccount: FC<{}> = () => {

	const data = useAppSelector(deleteAccountDataSelector);
	const [displayModal, changeDisplayModal] = useState(false);

	const dispatch = useAppDispatch();

	const formik = useFormik({
		initialValues: {
			password: ""
		},
		onSubmit(values) {
			changeDisplayModal(false);
			dispatch(deleteAccountAction());
		},
		validate(values) {
			const errors: any = {};

			if(!values.password) errors.password = "Confirm your password";

			return errors;
		}
	})

	return(
		<div className={style.deleteAccount}>
			<h2 className={style.deleteAccount__title}>
				Delete account
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
				<p className={style.deleteAccount__errorMessage}>
					{data.error}
				</p>
				:
				null
			}
			<form className={`${style.deleteAccount__form} ${style.form}`} onSubmit={formik.handleSubmit}>
				{
					displayModal
					?
					<div className={`${style.form__modal} ${style.modal}`}>
						<div className={style.modal__body}>
							<p className={style.modal__text}>
								Are you sure you wanna delete your account? It will be impossible to restore it after deleting.
							</p>
							<div className={style.modal__controls}>
								<div className={style.modal__control}>
									<input
										type="submit"
										className={style.deleteAccount__btn}
										value="Yes"
									/>
								</div>
								<div className={style.modal__control}>
									<input
										type="button"
										className={style.deleteAccount__btn}
										value="No"
										onClick={() => changeDisplayModal(false)}
									/>
								</div>
							</div>
						</div>
					</div>
					:
					null
				}
				<div className={style.form__fields}>
					<div className={style.form__field}>
						<input
							type="password"
							className={style.form__input}
							id="password"
							name="password"
							placeholder="Confirm your password"
							disabled={data.loading}
							value={formik.values.password}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
					</div>
				</div>
				<div className={style.form__controls}>
					<div className={style.form__control}>
						<input
							type="button"
							className={style.deleteAccount__btn}
							value="Delete"
							disabled={data.loading}
							onClick={() => formik.values.password ? changeDisplayModal(true) : null}
						/>
					</div>
				</div>
			</form>
		</div>
	)
}

export default DeleteAccount;