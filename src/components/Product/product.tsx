import { FC } from "react";
import style from "./product.module.scss";

interface IProps {
	className?: string,
	id: string
}

const Product: FC<IProps> = ({ className="", id}) => {
	return(
		<div className={`${className} ${style.product}`}>
			ID: {id}
		</div>
	)
}

export default Product;