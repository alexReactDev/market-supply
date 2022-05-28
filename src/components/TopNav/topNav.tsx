import { FC } from "react";
import { Link } from "react-router-dom";
import style from './topNav.module.scss';

interface IProps {
	className?: string
}

const TopNav: FC<IProps> = ({ className='' }) => {
	return (
		<nav className={`${className} ${style.navbar}`}>
			<div className='content'>
				<ul className={style.navbar__items}>
					<Link className="nav-link" to='/categories/clothing'>
						<li className={style.navbar__item}>
								CLOTHING
						</li>
					</Link>
					<Link className="nav-link" to='/categories/electronics'>
						<li className={style.navbar__item}>
							ELECTRONICS
						</li>
					</Link>
					<Link className="nav-link" to='/categories/shoes'>
						<li className={style.navbar__item}>
							SHOES
						</li>
					</Link>
					<Link className="nav-link" to='/categories/watches'>
						<li className={style.navbar__item}>
							WATCHES
						</li>
					</Link>
					<Link className="nav-link" to='/categories/jewellery'>
						<li className={style.navbar__item}>
							JEWELLERY
						</li>
					</Link>
					<Link className="nav-link" to='/categories/health-and-beauty'>
						<li className={style.navbar__item}>
							{"HEALTH&BEAUTY"}
						</li>
					</Link>
					<Link className="nav-link" to='/categories/kids-and-babies'>
						<li className={style.navbar__item}>
							{"KIDS&BABIES"}
						</li>
					</Link>
					<Link className="nav-link" to='/categories/sports'>
						<li className={style.navbar__item}>
							SPORTS
						</li>
					</Link>
					<Link className="nav-link" to='/categories/home-and-garden'>
						<li className={style.navbar__item}>
							{"HOME&GARDEN"}
						</li>
					</Link>
				</ul>
			</div>
		</nav>
	)
}

export default TopNav;