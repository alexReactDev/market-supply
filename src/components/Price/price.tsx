import { FC } from "react";
import CurrencyConverter from "../CurrencyConverter";
import style from "./price.module.scss";

interface IProps {
	className?: string,
	price: number,
	oldPrice?: number | null
}

const Price: FC<IProps> = ({ className="", price, oldPrice}) => {
	return(
		<div className={`${className} ${style.price}`}>
			{
				oldPrice
				?
				<span className={style.price__oldValue}>
					<CurrencyConverter value={oldPrice} />
				</span>
				: 
				null
			}
			<span className={style.price__value}>
				<CurrencyConverter value={price} />
			</span>
		</div>
	)
}

export default Price;