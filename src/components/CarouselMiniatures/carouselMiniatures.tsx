import { FC, useEffect, useState } from "react";
import { IoMdArrowDropleftCircle, IoMdArrowDroprightCircle } from "react-icons/io";
import Slider from "react-slick";
import ProductMini from "../ProductMini";
import style from "./carouselMiniatures.module.scss";

interface IProps {
	className?: string,
	title: string,
	products: string[],
	autoplay?: boolean
}

const CarouselMiniatures: FC<IProps> = ({ className="", title, products, autoplay }) => {

	const [sliderRef, setRef] = useState<any>(null);
	
	if(products.length === 0) return null;

	const productsChunks: Array<string[]> = [];

	products.forEach((productId, idx) => {
		if(idx % 6 === 0) productsChunks.push([productId]);
		else productsChunks[productsChunks.length - 1].push(productId);
	})

	console.log(productsChunks);

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
			<Slider className={style.carousel__slider} ref={(e) => setRef(e)}>
				{
					productsChunks.map((productChunk) => {
						return(
							<div className={style.carousel__sliderItem}>
								{
									productChunk.map((productId) => {
										return(
											<ProductMini className={style.carousel__product} id={productId} />
										)
									})
								}
							</div>
						)
					})
				}
			</Slider>
		</div>
	)
}

export default CarouselMiniatures;