import { FC } from "react";
import style from "./rate.module.scss";

interface IProps {
	className?: string,
	rate: number
}

const Rate: FC<IProps> = ({ className="", rate}) => {
	return(
		<div className={`${className} ${style.rate}`}>
			<span className={`${style.rate__star} ${rate >= 1 ? style.rate__star_active : ""}`} />
			<span className={`${style.rate__star} ${rate >= 2 ? style.rate__star_active : ""}`} />
			<span className={`${style.rate__star} ${rate >= 3 ? style.rate__star_active : ""}`} />
			<span className={`${style.rate__star} ${rate >= 4 ? style.rate__star_active : ""}`} />
			<span className={`${style.rate__star} ${rate >= 5 ? style.rate__star_active : ""}`} />
		</div>
	)
}

export default Rate;