import { FC } from "react";
import style from './banner.module.scss';

interface IProps {
	className?: string,
	alt?: string
	src: string
}

const Banner: FC<IProps> = ({ className='', alt='banner', src }) => {
	return(
		<div className={className}>
			<img className={style.banner__img} src={src} alt={alt} />
		</div>
	)
}

export default Banner;