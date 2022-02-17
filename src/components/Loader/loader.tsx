import { FC } from "react"
import style from "./loader.module.scss";

interface IState {
	className?: string
}

const Loader: FC<IState> = ({ className="" }) => {
	return(
		<div className={`${className} ${style.loader}`}>
			<div className={`spinner-grow ${style.loader__spinner}`} />
		</div>
	)
}

export default Loader;