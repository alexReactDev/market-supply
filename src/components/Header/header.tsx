import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { logoutAction } from "../../redux/actions";
import { setMenuClosed, setMenuOpen } from "../../redux/reducer/menu";
import { cartAmountSelector, loggedInSelector, menuOpenSelector, whitelistAmountSelector } from "../../redux/selectors";
import Burger from "../Burger";
import Links from "../Links";
import Logo from "../Logo";
import MiniCart from "../MiniCart";
import Search from "../Search";
import TopNav from "../TopNav";
import style from './header.module.scss';

const Header: FC<{}> = () => {

	const [adaptive, setAdaptive] = useState(document.documentElement.clientWidth > 1024 ? false : true);

	const menuOpen = useAppSelector(menuOpenSelector);
	const cartAmount = useAppSelector(cartAmountSelector);
	const whitelistAmount = useAppSelector(whitelistAmountSelector);
	const loggedIn = useAppSelector(loggedInSelector);

	const dispatch = useAppDispatch();

	useEffect(() => {
		const resizeHandler = () => setAdaptive(document.documentElement.clientWidth > 1024 ? false : true);

		window.addEventListener('resize', resizeHandler);

		return () => window.removeEventListener('resize', resizeHandler);
	})

	useEffect(() => {
		if(menuOpen) document.body.style.overflowY = 'hidden';
		else document.body.style.overflowY = "auto";
	})

	const handleClick = () => menuOpen ? dispatch(setMenuClosed()) : dispatch(setMenuOpen());

	return(
		<div className={style.header}>
			<div className="content">
				<div className={style.header__body}>
					<Logo className={style.header__logo} />
					<Burger className={`${style.header__burger} ${menuOpen ? style.header__burger_active : ""}`} active={menuOpen} onClick={handleClick} />
					<div className={`${style.header__content} ${menuOpen ? style.header__content_active : ""}`}>
						<ul className={`${style.header__links} ${style.links}`}>
							<li className={style.links__link}>
								<Link to={"/account"} className={`${style.links__text} nav-link`}>
									My account
								</Link>
							</li>
							<li className={style.links__link}>
								<Link to={"/whitelist"} className={`${style.links__text} nav-link`}>
									{
										whitelistAmount > 0
										?
										<div className={style.links__amount}>
											{whitelistAmount}
										</div>	
										:
										null
									}
									Wishlist
								</Link>
							</li>
							<li className={style.links__link}>
								<Link to={"/cart"} className={`${style.links__text} nav-link`}>
									{
										cartAmount > 0
										?
										<div className={style.links__amount}>
											{cartAmount}
										</div>	
										:
										null
									}
									Cart
								</Link>
							</li>
							<li className={style.links__link}>
								<Link to={"/checkout"} className={`${style.links__text} nav-link`}>
									Checkout
								</Link>
							</li>
							<li className={style.links__link}>
								{
									loggedIn
									?
									<input 
										type="button"
										className={style.links__logoutBtn}
										value="Log out"
										onClick={() => dispatch(logoutAction())}
									/>
									:
									<Link to={"/login"} className={`${style.links__text} nav-link`}>
										Login
									</Link>
								}
							</li>
						</ul>
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