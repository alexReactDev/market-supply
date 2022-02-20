import { FC } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { categoriesSelector, publicCategoriesKeysSelector } from "../../redux/selectors";

import style from "./asideNav.module.scss";

interface IProps {
	className?: string
}

const AsideNav: FC<IProps> = ({ className="" }) => {

	const categories = useSelector(categoriesSelector);
	const publicCategories = useSelector(publicCategoriesKeysSelector);

	return(
		<ul className={`${className} ${style.nav}`}>
			{
				publicCategories.map((cat) => {
					return(
						<li className={style.nav__item} key={cat}>
							<Link to={`/categories/${cat}`} className={`${style.nav__link} nav-link`}>
								{categories[cat].name}
							</Link>
						</li>
					)
				})
			}
		</ul>
	)
}

export default AsideNav;