import { Link } from "react-router-dom";
import { FC } from "react";
import style from "./errorPage.module.scss";

import img from "../../images/error/box.png";

const ErrorPage: FC<{}> = () => {
	return(
		<div className={style.error}>
			<h2 className={style.error__title}>
				Ooops... something went wrong
			</h2>
			<div className={style.error__picture}>
				<img className={style.error__img} src={img} />
			</div>
			<Link to="/" className={style.error__link} >
				Get back to homepage
			</Link>
		</div>
	)
}

export default ErrorPage;