import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../hooks";
import { collectionsSelector, foldersWithItemsSelector } from "../../redux/selectors";
import Burger from "../Burger";
import style from './topNav.module.scss';

interface IProps {
	className?: string
}

const TopNav: FC<IProps> = ({ className='' }) => {

	const folders = useAppSelector(foldersWithItemsSelector);
	const collections = useAppSelector(collectionsSelector);

	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<nav className={`${className} ${style.navbar}`}>
			<div className='content'>
				<ul className={style.navbar__items}>
					<li className={`${style.navbar__hiddenMenu} ${style.hiddenMenu}`}>
						<div className={`${style.hiddenMenu__modal} ${menuOpen ? style.hiddenMenu__modal_visible : ""}`} onClick={() => setMenuOpen(false)} />
						<Burger className={style.hiddenMenu__burger} active={menuOpen} onClick={() => setMenuOpen(!menuOpen)} />
						<div className={`${style.hiddenMenu__body} ${menuOpen ? style.hiddenMenu__body_visible : ""}`}>
							{
								folders.map((folder) => {
									return(
										<ul key={folder.id} className={style.hiddenMenu__folder}>
											<p className={style.hiddenMenu__title}>
												{folder.name}
											</p>
											{
												folder.items.map((cat) => {
													return(
														<li key={cat.id} className={style.hiddenMenu__category}>
															<Link to={`/categories/${folder.url_name}/${cat.url_name}`} className={`${style.hiddenMenu__link} nav-link`} >
																{cat.name}
															</Link>
														</li>
													)
												})
											}
										</ul>
									)
								})
							}
							<ul className={style.hiddenMenu__folder}>
								<p className={style.hiddenMenu__title}>
									Special	 
								</p>
								{
									Array.from(Object.keys(collections)).map((col) => {
										const collection = collections[col];

										return(
											<li key={collection.id} className={style.hiddenMenu__category}>
												<Link to={`/collections/${collection.url_name}`} className={`${style.hiddenMenu__link} nav-link`} >
													{collection.name}
												</Link>
											</li>
										)
									})
								}
							</ul>
						</div>
					</li>
					{
						Array.from(Object.keys(collections)).map((col) => {
							const collection = collections[col];

							return(
								<Link to={`/collections/${collection.url_name}`} className={style.navbar__item}>
									<li>
										{collection.name}
									</li>
								</Link>
							)
						})
					}
				</ul>
			</div>
		</nav>
	)
}

export default TopNav;