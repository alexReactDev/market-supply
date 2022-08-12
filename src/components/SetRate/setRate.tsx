import { FC, useState } from "react";
import style from "./setRate.module.scss";

interface IProps {
	className?: string,
	rate: number,
	onRate: (r: number) => void
}

const SetRate: FC<IProps> = ({ className="", onRate, rate }) => {

	const [visualRate, setVisualRate] = useState(0);

	return(
		<div className={`${className} ${style.rate}`}>
			<span className={`${style.rate__star} ${visualRate >= 1 ? style.rate__star_active : rate >= 1 && !visualRate ? style.rate__star_active : ""}`} 
			onClick={() => onRate(1)} 
			onMouseEnter={() => setVisualRate(1)}
			onMouseLeave={() => setVisualRate(0)}
			/>
			<span className={`${style.rate__star} ${visualRate >= 2 ? style.rate__star_active : rate >= 2 && !visualRate ? style.rate__star_active : ""}`} 
			onClick={() => onRate(2)} 
			onMouseEnter={() => setVisualRate(2)}
			onMouseLeave={() => setVisualRate(0)}
			/>
			<span className={`${style.rate__star} ${visualRate >= 3 ? style.rate__star_active : rate >= 3 && !visualRate ? style.rate__star_active : ""}`} 
			onClick={() => onRate(3)} 
			onMouseEnter={() => setVisualRate(3)}
			onMouseLeave={() => setVisualRate(0)}
			/>
			<span className={`${style.rate__star} ${visualRate >= 4 ? style.rate__star_active : rate >= 4 && !visualRate ? style.rate__star_active : ""}`} 
			onClick={() => onRate(4)} 
			onMouseEnter={() => setVisualRate(4)}
			onMouseLeave={() => setVisualRate(0)}
			/>
			<span className={`${style.rate__star} ${visualRate >= 5 ? style.rate__star_active : rate >= 5 && !visualRate ? style.rate__star_active : ""}`} 
			onClick={() => onRate(5)} 
			onMouseEnter={() => setVisualRate(5)}
			onMouseLeave={() => setVisualRate(0)}
			/>
		</div>
	)
}

export default SetRate;