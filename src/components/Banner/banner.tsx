import { FC } from "react";
import style from './banner.module.scss';

interface IProps {
	className?: string,
	alt?: string
	src: string,
	href?: string
}

const Banner: FC<IProps> = ({ className='', alt='banner', src, href }) => {
	return(
		<a href={href} className={`${className} ${style.banner}`}>
			<img className={style.banner__img} src={src} alt={alt} />
		</a>
	)
}

export default Banner;