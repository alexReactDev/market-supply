import { useFormik } from "formik";
import { FC } from "react";
import { Link, Redirect } from "react-router-dom";
import { loggedInSelector, loginErrorSelector, loginLoadingSelector } from "../../redux/selectors";
import { useAppDispatch, useAppSelector } from "../../hooks";
import style from "./login.module.scss";
import Loader from "../Loader";
import { loginAction } from "../../redux/actions";

const Login: FC<{}> = () => {

	const loggedIn = useAppSelector(loggedInSelector);
	const loading = useAppSelector(loginLoadingSelector);
	const error = useAppSelector(loginErrorSelector);

	const dispatch = useAppDispatch();

	const formik = useFormik({
		initialValues: {
			email: "",
			password: ""
		},
		onSubmit(values) {
			dispatch(loginAction(values));
		}
	})

	if(loggedIn) return <Redirect to="/" />

	return(
		<div className={style.login}>
			{
				loading
				?
				<Loader />
				:
				null
			}
			{
				error
				?
				<div className={style.login__errorShell}>
					<p className={style.login__error}>
						{error}
					</p>
				</div>
				:
				null
			}
			<div className={style.login__body}>
				<h3 className={style.login__title}>
					Login
				</h3>
				<form className={`${style.login__inputs} ${style.inputs}`} onSubmit={formik.handleSubmit}>
					<div className={style.inputs__row}>
						<input
							type="email"
							className={style.inputs__input}
							placeholder="Email"
							id="email"
							name="email"
							disabled={loading}
							value={formik.values.email}
							onChange={formik.handleChange}
						/>
					</div>
					<div className={style.inputs__row}>
						<input
							type="password"
							className={style.inputs__input}
							placeholder="Password"
							id="password"
							name="password"
							disabled={loading}
							value={formik.values.password}
							onChange={formik.handleChange}
						/>
					</div>
					<div className={style.inputs__row}>
						<div className={style.inputs__column}>
							<input 
								type="submit"
								className={style.inputs__btn}
								disabled={loading}
								value="Login"
							/>
						</div>
						<div className={style.inputs__column}>
							<Link to="/sign-up" className="nav-link">
								<input 
									type="button"
									className={style.inputs__btn}
									disabled={loading}
									value="Sign up"
								/>	
							</Link>
						</div>
					</div>
				</form>
			</div>
		</div>
	)
}

export default Login;