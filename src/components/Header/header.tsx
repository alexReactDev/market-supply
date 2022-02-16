import { FC, useEffect, useState } from "react";
import Burger from "../Burger";
import Links from "../Links";
import Logo from "../Logo";
import MiniCart from "../MiniCart";
import Search from "../Search";
import TopNav from "../TopNav";
import style from './header.module.scss';

const Header: FC<{}> = () => {

	const [menuOpen, setState] = useState(false);

	const [adaptive, setAdaptive] = useState(document.documentElement.clientWidth > 1024 ? false : true);

	useEffect(() => {
		const resizeHandler = () => setAdaptive(document.documentElement.clientWidth > 1024 ? false : true);

		window.addEventListener('resize', resizeHandler);

		return () => window.removeEventListener('resize', resizeHandler);
	})

	useEffect(() => {
		if(menuOpen) document.body.style.overflowY = 'hidden';
		else document.body.style.overflowY = "auto";
	})

	const headerLinks = [
		{
			link: '/account',
			text: 'My Account'
		},
		{
			link: '/whitelist',
			text: 'Whitelist'
		},
		{
			link: '/cart',
			text: 'My cart'
		},
		{
			link: '/checkout',
			text: 'Checkout'
		},
		{
			link: '/login',
			text: 'Login'
		}
	]

	return(
		<div className={style.header}>
			<div className="content">
				<div className={style.header__body}>
					<Logo className={style.header__logo} />
					<Burger className={style.header__burger} active={menuOpen} onClick={() => setState(!menuOpen)} />
					<div className={`${style.header__content} ${menuOpen ? style.header__content_active : ""}`}>
						<Links className={style.header__links} links={headerLinks} />
						<div className={style.header__items}>
							<Search className={style.header__search} />
							<MiniCart className={style.header__cart} />
						</div>
						{
							adaptive
							?
							<TopNav className={`${style.header__nav} ${menuOpen ? style.header__nav_active : ""}`} />
							:
							null
						}
					</div>
				</div>
			</div>
			{
				adaptive
				?
				null
				:
				<TopNav className={style.header__nav} />
			}
			
		</div>
	)
}

export default Header;