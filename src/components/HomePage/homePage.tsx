import { FC, useEffect } from "react";
import Banner from "../Banner";
import style from "./homePage.module.scss";

import banner1 from "../../images/banners/0.jpg";
import banner2 from "../../images/banners/2.jpg";
import banner3 from "../../images/banners/3.jpg";
import banner4 from "../../images/banners/4.jpg";
import { useDispatch, useSelector } from "react-redux";
import { categoriesSelector } from "../../redux/selectors";
import Carousel from "../Carousel";
import { loadCategoryDataWithProducts } from "../../redux/actions";
import TilesWrapper from "../TilesWrapper";
import CarouselMiniatures from "../CarouselMiniatures";

const HomePage: FC<{}> = () => {

	const categories = useSelector(categoriesSelector);
	const dispatch = useDispatch();

	useEffect(() => {
		if(
			categories["new"].products.length === 0 &&
			!categories["new"].done &&
			!categories["new"].loading
		)
		{
			dispatch(loadCategoryDataWithProducts("new"));
		}

		if(
			categories["latest"].products.length === 0 &&
			!categories["latest"].done &&
			!categories["latest"].loading
		)
		{
			dispatch(loadCategoryDataWithProducts("latest"));
		}

		if(
			categories["featured"].products.length === 0 &&
			!categories["featured"].done &&
			!categories["featured"].loading
		)
		{
			dispatch(loadCategoryDataWithProducts("featured"));
		}
	})

	return(
		<div className={style.homePage}>
			<Banner className={style.homePage__item} src={banner1} />
			<Carousel 
				className={style.homePage__item} 
				title="NEW PRODUCTS" 
				products={categories["new"].products} 
				maxCards={4}
				autoplay={true} 
			/>
			<TilesWrapper className={`${style.homePage__tiles}`} >
				<Banner className={style.homePage__item} src={banner2} />
				<Banner className={style.homePage__item} src={banner3} />
			</TilesWrapper>
			<Carousel 
				className={style.homePage__item} 
				title="LATEST PRODUCTS" 
				products={categories["latest"].products} 
				maxCards={4}
				autoplay={true} 
			/>
			<Banner className={style.homePage__item} src={banner4} />
			<CarouselMiniatures 
				className={style.homePage__item}
				title="FEATURED PRODUCTS"
				products={categories["featured"].products}
			/>
		</div>
	)
}

export default HomePage;