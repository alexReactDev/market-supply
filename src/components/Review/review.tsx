import { FC } from "react";
import Rate from "../Rate";
import style from './review.module.scss';

interface IProps {
	className?: string, 
	title: string,
	rate: number,
	text: string,
	timestamp: number
}

const Review: FC<IProps> = ({ className="", title, rate, text, timestamp }) => {
	return(
		<div className={`${className} ${style.review}`}>
			<div className={style.review__head}>
				<span className={style.review__name}>
					{title}
				</span>
				<Rate className={style.review__rate} rate={rate} />
			</div>
			<p className={style.review__text}>
				{text}	
			</p>
			<p className={style.review__date}>
				{`${new Date(timestamp).getHours()}:${new Date(timestamp).getMinutes() > 10 ? new Date(timestamp).getMinutes() : "0" + new Date(timestamp).getMinutes() } ${new Date(timestamp).toDateString()}`}
			</p>
		</div>
	)
}

export default Review;