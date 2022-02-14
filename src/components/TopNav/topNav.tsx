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
					<li className={style.navbar__item}>
						<Link className="nav-link" to='/categories/clothing'>
							CLOTHING
						</Link>
					</li>
					<li className={style.navbar__item}>
						<Link className="nav-link" to='/categories/electronics'>
							ELECTRONICS
						</Link>
					</li>
					<li className={style.navbar__item}>
						<Link className="nav-link" to='/categories/shoes'>
							SHOES
						</Link>
					</li>
					<li className={style.navbar__item}>
						<Link className="nav-link" to='/categories/watches'>
							WATCHES
						</Link>
					</li>
					<li className={style.navbar__item}>
						<Link className="nav-link" to='/categories/jewellery'>
							JEWELLERY
						</Link>
					</li>
					<li className={style.navbar__item}>
						<Link className="nav-link" to='/categories/health-and-beauty'>
							{"HEALTH&BEAUTY"}
						</Link>
					</li>
					<li className={style.navbar__item}>
						<Link className="nav-link" to='/categories/kids-and-babies'>
							{"KIDS&BABIES"}
						</Link>
					</li>
					<li className={style.navbar__item}>
						<Link className="nav-link" to='/categories/sports'>
							SPORTS
						</Link>
					</li>
					<li className={style.navbar__item}>
						<Link className="nav-link" to='/categories/home-and-garden'>
							{"HOME&GARDEN"}
						</Link>
					</li>
				</ul>
			</div>
		</nav>
	)
}

export default TopNav;