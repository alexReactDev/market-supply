import { FC } from "react";
import logoImg from '../../images/logo/logo.png';
import style from './logo.module.scss';

interface IProps {
	className?: string
}

const Logo: FC<IProps> = ({ className='' }) => {
	return(
		<div className={className}>
			<img className={style.logo__img} src={logoImg} alt="logo" />
		</div>
	)
}

export default Logo;