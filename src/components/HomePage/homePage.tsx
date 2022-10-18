import { FC, useEffect } from "react";
import Banner from "../Banner";
import style from "./homePage.module.scss";

import banner1 from "../../images/banners/0.jpg";
import banner2 from "../../images/banners/2.jpg";
import banner3 from "../../images/banners/3.jpg";
import banner4 from "../../images/banners/4.jpg";
import { useDispatch, useSelector } from "react-redux";
import { collectionsSelector } from "../../redux/selectors";
import Carousel from "../Carousel";
import { loadCollectionDataByUrlName } from "../../redux/actions";
import TilesWrapper from "../TilesWrapper";
import CarouselMiniatures from "../CarouselMiniatures";

const HomePage: FC<{}> = () => {

	const collections = useSelector(collectionsSelector);
	const dispatch = useDispatch();

	useEffect(() => {
		if(
			!collections["new"].error &&
			!collections["new"].loaded &&
			!collections["new"].loading
		)
		{
			dispatch(loadCollectionDataByUrlName("new"));
		}

		if(
			!collections["latest"].error &&
			!collections["latest"].loaded &&
			!collections["latest"].loading
		)
		{
			dispatch(loadCollectionDataByUrlName("latest"));
		}

		if(
			!collections["featured"].error &&
			!collections["featured"].loaded &&
			!collections["featured"].loading
		)
		{
			dispatch(loadCollectionDataByUrlName("featured"));
		}
	})

	return(
		<div className={style.homePage}>
			<Banner className={style.homePage__item} src={banner1} href="/categories/clothing/subcategory-1" />
			<Carousel 
				className={style.homePage__item} 
				title="NEW PRODUCTS" 
				products={collections["new"].products} 
				maxCards={4}
				autoplay={true} 
				link="/collections/new"
			/>
			<TilesWrapper className={`${style.homePage__tiles}`} >
				<Banner className={style.homePage__item} src={banner2} />
				<Banner className={style.homePage__item} src={banner3} />
			</TilesWrapper>
			<Carousel 
				className={style.homePage__item} 
				title="LATEST PRODUCTS" 
				products={collections["latest"].products} 
				maxCards={4}
				autoplay={true} 
				link="/collections/latest"
			/>
			<Banner className={style.homePage__item} src={banner4} href="/categories/electronics/subcategory-1" />
			<CarouselMiniatures 
				className={style.homePage__item}
				title="FEATURED PRODUCTS"
				products={collections["featured"].products}
				link="/collections/featured"
				autoplay={true}
			/>
		</div>
	)
}

export default HomePage;