import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { collectionsSelector } from "../../redux/selectors";
import { loadCollectionDataByUrlName } from "../../redux/actions";
import AsideNav from "../AsideNav";
import Banner from "../Banner";
import Newsletter from "../Newsletter";
import Carousel from "../Carousel";
import style from "./aside.module.scss";
import banner from "../../images/banners/1.jpg";
interface IProps {
	className?: string
}

const Aside: FC<IProps> = ({ className="" }) => {

	const collections = useSelector(collectionsSelector);
	const dispatch = useDispatch();

	useEffect(() => {
		if(
			!collections["hot-deal"].error &&
			!collections["hot-deal"].loaded &&
			!collections["hot-deal"].loading
		)
		{
			dispatch(loadCollectionDataByUrlName("hot-deal"));
		}

		if(
			!collections["special-deal"].error &&
			!collections["special-deal"].loaded &&
			!collections["special-deal"].loading
		)
		{
			dispatch(loadCollectionDataByUrlName("special-deal"));
		}
	})

	return (
		<aside className={`${className} ${style.aside}`}>
			<AsideNav className={style.aside__item} />
			<Carousel
				className={style.aside__item}
				title="HOT DEAL" 
				products={collections["hot-deal"].products}
				link="/collections/hot-deal"
			/>
			<Carousel 
				className={style.aside__item} 
				title="SPECIAL DEAL" 
				products={collections["special-deal"].products}
				link="/collections/special-deal"
			/>
			<Newsletter className={style.aside__item} />
			<Banner className={style.aside__item} src={banner} />
		</aside>
	)
}

export default Aside;