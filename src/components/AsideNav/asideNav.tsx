import { FC, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { foldersWithItemsSelector } from "../../redux/selectors";

import style from "./asideNav.module.scss";

interface IProps {
	className?: string
}

const AsideNav: FC<IProps> = ({ className="" }) => {

	const categories = useSelector(foldersWithItemsSelector);

	const [openCat, setOpenCat] = useState<number | null>(null);

	return(
		<ul className={`${className} ${style.nav}`}>
			{
				categories.map((cat) => {
					return(
						<li className={`${style.nav__item} ${style.folder}`} key={cat.id}>
							<div className={style.folder__profile} onClick={() => setOpenCat(cat.id)} >
								<div className={`${style.folder__isOpen} ${openCat === cat.id ? style.folder__isOpen_true : ""}`} />
								<p className={style.folder__name}>
									{cat.name}
								</p>
							</div>
							<ul className={`${style.folder__items} ${openCat === cat.id ? style.folder__items_visible : ""}`}>
								{
									cat.items.map((item) => {
										return (
										<Link to={`/categories/${cat.url_name}/${item.url_name}`} className={`${style.folder__itemLink} nav-link`}>
											<li className={style.folder__item} key={item.id}>
													<p className={style.folder__itemName}>
														{item.name}
													</p>
											</li>
										</Link>
										)
									})
								}
							</ul>
						</li>
					)
				})
			}
		</ul>
	)
}

export default AsideNav;