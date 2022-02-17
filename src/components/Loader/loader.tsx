import { FC } from "react"
import style from "./loader.module.scss";
import loader from "../../images/loader/loader.gif";

interface IState {
	className?: string
}

const Loader: FC<IState> = ({ className="" }) => {
	return(
		<div className={`${className} ${style.loader}`}>
			<img className={style.loader__spinner} src={loader} alt="Loading..." />
		</div>
	)
}

export default Loader;