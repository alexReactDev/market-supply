import { FormikValues, useFormik } from "formik";
import { FC } from "react";
import { useDispatch } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { useAppSelector } from "../../hooks";
import { signUpAction } from "../../redux/actions";
import { loggedInSelector, signUpErrorSelector, signUpLoadingSelector } from "../../redux/selectors";
import Loader from "../Loader";
import style from "./signup.module.scss";

const SignUp: FC<{}> = () => {

	const loggedIn = useAppSelector(loggedInSelector);
	const loading = useAppSelector(signUpLoadingSelector);
	const error = useAppSelector(signUpErrorSelector);

	const dispatch = useDispatch();

	const formik = useFormik({
		initialValues: {
			name: "",
			surname: "",
			email: "",
			password: "",
			repeatPassword: ""
		},
		onSubmit(values) {
			const {repeatPassword, ...signUpData} = values;

			dispatch(signUpAction(signUpData));
		},
		validate(values) {
			const errors = {} as FormikValues;

			if(!values.name) errors.name = "Name field is required";

			if(!values.email) errors.email = "Email field is required";

			if(!values.password) errors.password = "Password field is required";

			if(!values.repeatPassword) errors.repeatPassword = "Repeat password field is required";

			if(values.repeatPassword !== values.password) errors.repeatPassword = "Passwords do not match";

			return errors;
		}
	})

	if(loggedIn) return <Redirect to={"/"} />

	return(
		<div className={style.signUp}>
						{
				loading
				?
				<Loader />
				:
				null
			}
			{
				(formik.errors.repeatPassword && formik.touched.repeatPassword) || error
				?
				<div className={style.signUp__errorShell}>
					<p className={style.signUp__error}>
						{
							formik.errors.repeatPassword
							?
							formik.errors.repeatPassword
							:
							error
						}
					</p>
				</div>
				:
				null
			}
			<div className={style.signUp__body}>
				<h3 className={style.signUp__title}>
					Sign up
				</h3>
				<form className={`${style.signUp__inputs} ${style.inputs}`} onSubmit={formik.handleSubmit}>
					<div className={style.inputs__row}>
						<div className={style.inputs__column}>
							<input
								type="text"
								className={style.inputs__input}
								id="name"
								name="name"
								placeholder="Name"
								disabled={loading}
								value={formik.values.name}
								onChange={formik.handleChange}
							/>
						</div>
						<div className={style.inputs__column}>
							<input
								type="text"
								className={style.inputs__input}
								id="surname"
								name="surname"
								placeholder="Surname (Optional)"
								disabled={loading}
								value={formik.values.surname}
								onChange={formik.handleChange}
							/>
						</div>
					</div>
					<div className={style.inputs__row}>
						<input
							type="email"
							className={style.inputs__input}
							id="email"
							name="email"
							placeholder="Email"
							disabled={loading}
							value={formik.values.email}
							onChange={formik.handleChange}
						/>
					</div>
					<div className={style.inputs__row}>
						<input
							type="password"
							className={style.inputs__input}
							id="password"
							name="password"
							placeholder="Password"
							disabled={loading}
							value={formik.values.password}
							onChange={formik.handleChange}
						/>
					</div>
					<div className={style.inputs__row}>
						<input
							type="password"
							className={style.inputs__input}
							id="repeatPassword"
							name="repeatPassword"
							placeholder="Repeat password"
							disabled={loading}
							value={formik.values.repeatPassword}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
					</div>
					<div className={style.inputs__row}>
						<div className={style.inputs__column}>
							<Link to="/login" className="nav-link">
								<input 
									type="button"
									className={style.inputs__btn}
									disabled={loading}
									value="Login"
								/>	
							</Link>
						</div>
						<div className={style.inputs__column}>
							<input 
								type="submit"
								className={style.inputs__btn}
								disabled={loading}
								value="Sign up"
							/>
						</div>
					</div>
				</form>
			</div>
		</div>
	)
}

export default SignUp;