import { FC } from "react";
import style from './burger.module.scss';

interface IProps {
	className?: string,
	active: boolean,
	onClick: () => any
}

const Burger: FC<IProps> = ({ className='', active, onClick }) => {
	return(
		<div className={`${className} ${style.burger} ${active ? style.burger_active : ""}`} onClick={onClick} >
			<span className={style.burger__stripe} />
		</div>
	)
}

export default Burger;