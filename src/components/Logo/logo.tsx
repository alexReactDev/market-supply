import { FC } from "react";
import { Link } from "react-router-dom";
import logoImg from '../../images/logo/logo.png';
import style from './logo.module.scss';

interface IProps {
	className?: string
}

const Logo: FC<IProps> = ({ className='' }) => {
	return(
		<div className={className}>
			<Link to="/" className="nav-link">
				<img className={style.logo__img} src={logoImg} alt="logo" />
			</Link>
		</div>
	)
}

export default Logo;