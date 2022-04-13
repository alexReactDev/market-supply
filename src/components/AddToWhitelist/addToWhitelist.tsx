import { FC } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../hooks";
import { addToWhitelistAction, removeFromWhitelistAction } from "../../redux/actions";
import { whitelistProductsSelector } from "../../redux/selectors";
import style from "./addToWhitelist.module.scss";

interface IProps {
	className: string,
	id: string
}

const AddToWhitelist: FC<IProps> = ({ className="", id}) => {

	const whitelistProducts = useSelector(whitelistProductsSelector);
	const dispatch = useAppDispatch();

	const isProductInWhitelist: boolean = !!whitelistProducts.find((productId) => productId === id);

	const clickHandler = () => {
		if(isProductInWhitelist) {
			dispatch(removeFromWhitelistAction(id));
		}
		else {
			dispatch(addToWhitelistAction(id));
		}
	}

	return(
		<div className={`${className} ${style.addToWhitelist}`}>
			<span 
				className={`${style.addToWhitelist__star} ${isProductInWhitelist ? style.addToWhitelist__star_active : ""}`}
				onClick={clickHandler}
			 />
		</div>
	)
}

export default AddToWhitelist;