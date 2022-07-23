import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { productsDetailsSelector, productsReviewsSelector, productsSelector, URLPathEndSelector } from "../../redux/selectors";
import { loadProductByIdAction, loadProductDetailsAction, loadProductReviewsAction } from "../../redux/actions";
import { IProduct } from "../../redux/reducer/products";
import Loader from "../Loader";
import Rate from "../Rate";
import style from "./productDetails.module.scss";

import productPlaceholder from "../../images/products/placeholder.png";
import Price from "../Price";
import AddToCart from "../AddToCart";
import Slider from "react-slick";
import { IoMdArrowDropleftCircle, IoMdArrowDroprightCircle } from "react-icons/io";
import PublishReview from "../PublishReview";
import { IProductReviews } from "../../redux/reducer/productsReviews";
import Review from "../Review";
import AddToWhitelist from "../AddToWhitelist";

const ProductDetails: FC<{}> = () => {

	const productId = useSelector(URLPathEndSelector);
	const product = useSelector(productsSelector)[productId];
	const productDetails = useSelector(productsDetailsSelector)[productId];
	const productReviews = useSelector(productsReviewsSelector)[productId];
	const dispatch = useDispatch();

	useEffect(() => {
		if(!product) dispatch(loadProductByIdAction(productId));
		if(!productDetails) dispatch(loadProductDetailsAction(productId));
		if(!productReviews) dispatch(loadProductReviewsAction(productId));
	})
	
	const [isDescriptionOpen, setDescriptionOpen] = useState(false);
	const [sliderRef, setSliderRef] = useState<any>(null);
	const [currentPicture, setPicture] = useState<string>("");

	useEffect(() => {
		if(product && product.pictures.length > 0) setPicture(product.pictures[0]);
	}, [product])

	if (!product || !productDetails || !productReviews || product.loading || productDetails.loading || productReviews.loading) return <Loader />

	if (product?.error?.response?.status === 404) return <Redirect to="/404" />

	if(product.error) return <Redirect to="/error" />

	const { name, webId, rate, price, oldPrice, pictures } = product as IProduct;

	const { description } = productDetails.details;

	const sliderConfig = {
		slidesToShow: 3,
		arrows: false,
		draggable: false,
	}

	return(
		<div className={style.product}>
			<div className={style.product__basicInfo}>
				<div className={style.product__pictures}>
					<div className={style.product__mainPicture}>
						<img className={style.product__image} src={currentPicture || productPlaceholder} alt={product.name} />
					</div>
					<div className={style.product__additionalPictures}>
						<IoMdArrowDropleftCircle
							color="#f10e34" size="27px" 
							className={style.sliderButtonPrev}
							onClick={() => sliderRef?.slickPrev()}
						/>
						<Slider className={style.product__slider} ref={e => setSliderRef(e)} {...sliderConfig}>
							{
								pictures.map((src) => {
									console.log(src);
									return(
										<div className={style.sliderPicture} key={src} onClick={() => setPicture(src)} >
											<img src={src} className={style.sliderImg} alt="productPicture" />
										</div>
									)
								})
							}
						</Slider>
						<IoMdArrowDroprightCircle 
							color="#f10e34" size="27px" 
							className={style.sliderButtonNext} 
							onClick={() => sliderRef?.slickNext()}
						/>
					</div>
				</div>
				<div className={style.product__info}>
					<AddToWhitelist className={style.product__addToWhitelist} id={productId} />
					<h3 className={style.product__name}>
						{name}
					</h3>
					<h4 className={style.product__id}>
						WebId: {webId}
					</h4>
					<Rate className={style.product__rate} rate={rate} />
					<Price className={style.product__price} price={price} oldPrice={oldPrice} />
					<AddToCart className={style.product__addToCart}  productId={productId} />
					<div className={style.product__description}>
						<h4 className={style.product__descriptionTitle}>
							Description
						</h4>
						<p className={style.product__descriptionText}>
							{
								!description
								?
								"Failed to display description"
								:
								!isDescriptionOpen
								?
								description.slice(0, 500)
								:
								description
							}
						</p>
						{
							isDescriptionOpen
							?
							null
							:
							<div 
								className={style.product__descriptionOpen} 
								onClick={() => setDescriptionOpen(true)}
							></div>
						}
					</div>
				</div>
			</div>
			<div className={style.product__reviews}>
				<h3 className={style.product__titles}>
					Write Review
				</h3>
				<PublishReview productId={productId} className={style.product__publishReview} />
				<h3 className={style.product__titles}>
					Reviews
				</h3>
				<div className={style.product__existingReviews}>
					{
						(productReviews as IProductReviews).reviews.map((review) => {
							return(
								<Review 
									key={`${review.title}${review.text}${review.timestamp}`}	 
									className={style.product__review} 
									{...review} 
								/>
							)
						})
					}
				</div>
			</div>
		</div>
	)
}

export default ProductDetails;