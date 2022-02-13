import { FC } from "react";
import { useAppSelector } from "../../hooks";
import { cartTotal } from "../../redux/selectors";
import CurrencyConverter from "../CurrencyConverter";
import cartIcon from '../../images/icons/cart.png';
import style from './miniCart.module.scss';
import { Link } from "react-router-dom";

interface IProps {
	className: string
}

const MiniCart: FC<IProps> = ({ className='' }) => {
	const total = useAppSelector(cartTotal);

	return (
		<Link className={`${className} ${style.cart} nav-link`} to="/cart">
			<div className={style.cart__picture}>
				<img src={cartIcon} alt='cartIcon' />
			</div>
			<div className={style.cart__body}>
				<h4 className={style.cart__title}>
					TOTAL
				</h4>
				<p className={style.cart__total}>
					<CurrencyConverter value={total} />
				</p>
			</div>			
		</Link>
	)
}

export default MiniCart;