import React, { FC, useState } from "react";
import { useDispatch } from "react-redux";
import { productIncrementAction } from "../../redux/actions";
import style from "./addToCart.module.scss";

interface IProps {
	className?: string,
	productId: string,
	initialAmount?: number,
	maxAmount?: number
}

const AddToCart: FC<IProps> = ({ className="", productId, initialAmount = 0, maxAmount = 10 }) => {

	const [amount, setAmount] = useState(initialAmount);
	const dispatch = useDispatch();

	const increment = () => setAmount((prev) => prev === maxAmount ? maxAmount : prev + 1);
	const decrement = () => setAmount((prev) => prev - 1 > 0 ? prev - 1 : 0);
	const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = +e.target.value;
		if(isFinite(value)) setAmount(value > maxAmount ? maxAmount : value);
	}
	const add = () => dispatch(productIncrementAction(productId, amount));

	return(
		<div className={`${className} ${style.addToCart}`}>
			<div className={style.addToCart__amount}>
				<input type="button" className={style.addToCart__decrement} onClick={decrement} />
				<input type="number" className={style.addToCart__amountValue} value={amount} onChange={changeHandler} />
				<input type="button" className={style.addToCart__increment} onClick={increment} />
			</div>
			<div className={style.addToCart__buttons}>
				<input type="button" className={`${style.addToCart__addButton}`} value="Add to cart" onClick={add} />
			</div>
		</div>
	)
}

export default AddToCart;