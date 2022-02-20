import { FC, useState } from "react";
import { IoMdArrowDropleftCircle, IoMdArrowDroprightCircle } from "react-icons/io";
import Product from "../Product";
import style from "./carousel.module.scss";
import Slider from "react-slick";

interface IProps {
	className?: string,
	title: string,
	products: string[],
	maxCards?: 1 | 2 | 3 | 4
}

const Carousel: FC<IProps> = ({ className="", title, products, maxCards = 1 }) => {

	const [sliderRef, setSliderRef] = useState<any>(null);

	const sliderConfig = {
		slidesToShow: maxCards,
		slidesToScroll: 1,
		infinite: true,
		arrows: false,
		draggable: false,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					swipe: true,
					slidesToShow: maxCards > 3 ? 3 : maxCards
				}
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: maxCards > 2 ? 2 : maxCards
				}
			},
			{
				breakpoint: 580,
				settings: {
					slidesToShow: 1
				}
			}
		]
	}

	if(products.length === 0) return null;
	
	return(
		<div className={`${className} ${style.carousel}`}>
			<div className={style.carousel__header}>
				<h4 className={style.carousel__title}>
					{title}
				</h4>
				<div className={style.carousel__controls}>
					<IoMdArrowDropleftCircle
						color="#f10e34" size="27px" 
						className={style.carousel__button}
						onClick={() => sliderRef?.slickPrev()}
					 />
					<IoMdArrowDroprightCircle 
						color="#f10e34" size="27px" 
						className={style.carousel__button} 
						onClick={() => sliderRef?.slickNext()}
					/>
				</div>
			</div>
			<Slider className={style.carousel__slider} ref={e => setSliderRef(e)} {...sliderConfig} >
				{
					products.map((productId) => {
						return(
							<Product className={style.carousel__product} key={productId} id={productId} />
						)
					})
				}
			</Slider>
		</div>
	)
}

export default Carousel;