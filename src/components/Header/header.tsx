import { FC } from "react";
import Links from "../Links";
import Logo from "../Logo";
import MiniCart from "../MiniCart";
import Search from "../Search";
import TopNav from "../TopNav";
import style from './header.module.scss';

const Header: FC<{}> = () => {

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
					<div className={style.header__content}>
						<Links className={style.header__links} links={headerLinks} />
						<div className={style.header__items}>
							<Search className={style.header__search} />
							<MiniCart className={style.header__cart} />
						</div>
					</div>
				</div>
			</div>
			<TopNav />
		</div>
	)
}

export default Header;