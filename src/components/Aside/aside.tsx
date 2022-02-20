import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { categoriesSelector } from "../../redux/selectors";
import { loadCategoryDataWithProducts } from "../../redux/actions";
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

	const categories = useSelector(categoriesSelector);
	const dispatch = useDispatch();

	useEffect(() => {
		if(
			categories["hot-deal"].products.length === 0 &&
			!categories["hot-deal"].done &&
			!categories["hot-deal"].loading
		)
		{
			dispatch(loadCategoryDataWithProducts("hot-deal"));
		}

		if(
			categories["special-deal"].products.length === 0 &&
			!categories["special-deal"].done &&
			!categories["special-deal"].loading
		)
		{
			dispatch(loadCategoryDataWithProducts("special-deal"));
		}
	})

	return (
		<aside className={`${className} ${style.aside}`}>
			<AsideNav className={style.aside__item} />
			<Carousel
				className={style.aside__item}
				title="HOT DEALS" 
				products={categories["hot-deal"].products}
			/>
			<Carousel 
				className={style.aside__item} 
				title="SPECIAL DEAL" 
				products={categories["special-deal"].products}
			/>
			<Newsletter className={style.aside__item} />
			<Banner className={style.aside__item} src={banner} />
		</aside>
	)
}

export default Aside;