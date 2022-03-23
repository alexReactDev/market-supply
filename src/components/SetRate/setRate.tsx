import { FC, useState } from "react";
import style from "./setRate.module.scss";

interface IProps {
	className?: string,
	initialRate?: number,
	onRate: (r: number) => void
}

const SetRate: FC<IProps> = ({ className="", onRate, initialRate }) => {

	const [rate, setRate] = useState(initialRate || 0);

	const rateHandler = (r: number) => {
		setRate(r);
		onRate(r);
	}

	return(
		<div className={`${className} ${style.rate}`}>
			<span className={`${style.rate__star} ${rate >= 1 ? style.rate__star_active : ""}`} onClick={() => rateHandler(1)} />
			<span className={`${style.rate__star} ${rate >= 2 ? style.rate__star_active : ""}`} onClick={() => rateHandler(2)} />
			<span className={`${style.rate__star} ${rate >= 3 ? style.rate__star_active : ""}`} onClick={() => rateHandler(3)} />
			<span className={`${style.rate__star} ${rate >= 4 ? style.rate__star_active : ""}`} onClick={() => rateHandler(4)} />
			<span className={`${style.rate__star} ${rate >= 5 ? style.rate__star_active : ""}`} onClick={() => rateHandler(5)} />
		</div>
	)
}

export default SetRate;