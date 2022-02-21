import { FC } from "react";
import style from "./tilesWrapper.module.scss";

interface IProps {
	className?: string
}

const TilesWrapper: FC<IProps> = ({ className="", children }) => {
	return(
		<div className={`${className} ${style.container}`}>
			{children}
		</div>
	)
}

export default TilesWrapper;