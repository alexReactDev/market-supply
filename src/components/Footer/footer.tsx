import { FC } from "react";
import { Link } from "react-router-dom";
import Links from "../Links";
import Logo from "../Logo";

import style from './footer.module.scss';

import locationIcon from '../../images/icons/location.png';
import phoneIcon from '../../images/icons/phone.png';
import envelopeIcon from '../../images/icons/envelope.png';
import googlePlusIcon from'../../images/icons/g+.png';
import pinterestIcon from'../../images/icons/pinterest.png';
import vimeoIcon from'../../images/icons/vimeo.png';
import instagramIcon from'../../images/icons/instagram.png';
import facebookIcon from'../../images/icons/facebook.png';
import twitterIcon from'../../images/icons/twitter.png';
import rssIcon from'../../images/icons/rss.png';
import youtubeIcon from'../../images/icons/youtube.png';
import clockIcon from '../../images/icons/clock.png';
import paymentIcon1 from '../../images/payment-methods/0.png';
import paymentIcon2 from '../../images/payment-methods/1.png';
import paymentIcon3 from '../../images/payment-methods/2.png';
import paymentIcon4 from '../../images/payment-methods/3.png';
import paymentIcon5 from '../../images/payment-methods/4.png';
import paymentIcon6 from '../../images/payment-methods/5.png';
import paymentIcon7 from '../../images/payment-methods/6.png';

const Footer: FC<{}> = () => {
	const footerLinks = [
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
		},
		{
			link: '/contact-us',
			text: 'Contact Us'
		}
	]

	return(
		<footer className={style.footer}>
			<div className={style.footerTop}>
				<div className="content">
					<div className={style.footerTop__body}>
						<div className={style.footerTop__column}>
							<div className={style.footerTop__subcolumn}>
								<Logo className={style.footerTop__logo} />
								<p className={style.footerTop__text}>
									This is Photoshop's version of Lorem Ipsum.
									Proin gravida nibh velit it's a cold world out 
									there.
								</p>
								<div className={style.footerTop__itemsList}>
									<div className={`${style.footerTop__item} ${style.footerTop__item_withIcon}`}>
										<img src={locationIcon} alt="icon" />
										0123 Main Road, Your City, NY 123456	
									</div>
									<div className={`${style.footerTop__item} ${style.footerTop__item_withIcon}`}>
										<img src={phoneIcon} alt="icon" />
										(000) 2345 - 6789
									</div>
									<div className={`${style.footerTop__item} ${style.footerTop__item_withIcon}`}>
										<img src={envelopeIcon} alt="icon" />
										info@psdfreebies.com
									</div>
								</div>
							</div>
							<div className={style.footerTop__subcolumn}>
								<h4 className={style.footerTop__title}>
									INFORMATION
								</h4>
								<div className={style.footerTop__itemsList}>
									<Link to={'/'} className={`${style.footerTop__item} nav-link`}>
										Our Story
									</Link>
									<Link to={'/'} className={`${style.footerTop__item} nav-link`}>
										{'Privacy & Policy'}
									</Link>
									<Link to={'/'} className={`${style.footerTop__item} nav-link`}>
										{'Terms & Conditions'}
									</Link>
									<Link to={'/'} className={`${style.footerTop__item} nav-link`}>
										{'Shipping & Delivery'}
									</Link>
									<Link to={'/'} className={`${style.footerTop__item} nav-link`}>
										Careers
									</Link>
									<Link to={'/'} className={`${style.footerTop__item} nav-link`}>
										FAQs
									</Link>
								</div>
							</div>
						</div>
						<div className={style.footerTop__column}>
							<div className={style.footerTop__subcolumn}>
								<h4 className={style.footerTop__title}>
									OUR SOCIAL
								</h4>
								<div className={style.footerTop__row}>
									<div className={`${style.footerTop__cell} ${style.footerTop__itemsList}`}>
										<Link to={'/'} className={`${style.footerTop__item}  ${style.footerTop__item_withIcon} nav-link`}>
											<img src={googlePlusIcon} alt="icon" />
											Google+
										</Link>
										<Link to={'/'} className={`${style.footerTop__item}  ${style.footerTop__item_withIcon} nav-link`}>
											<img src={pinterestIcon} alt="icon" />
											Pinterest
										</Link>
										<Link to={'/'} className={`${style.footerTop__item}  ${style.footerTop__item_withIcon} nav-link`}>
											<img src={vimeoIcon} alt="icon" />
											Vimeo
										</Link>
										<Link to={'/'} className={`${style.footerTop__item}  ${style.footerTop__item_withIcon} nav-link`}>
											<img src={instagramIcon} alt="icon" />
											Instagram
										</Link>
									</div>
									<div className={`${style.footerTop__cell} ${style.footerTop__itemsList}`}>
										<Link to={'/'} className={`${style.footerTop__item}  ${style.footerTop__item_withIcon} nav-link`}>
											<img src={facebookIcon} alt="icon" />
											Facebook
										</Link>
										<Link to={'/'} className={`${style.footerTop__item}  ${style.footerTop__item_withIcon} nav-link`}>
											<img src={twitterIcon} alt="icon" />
											Twitter
										</Link>
										<Link to={'/'} className={`${style.footerTop__item}  ${style.footerTop__item_withIcon} nav-link`}>
											<img src={rssIcon} alt="icon" />
											RSS
										</Link>
										<Link to={'/'} className={`${style.footerTop__item}  ${style.footerTop__item_withIcon} nav-link`}>
											<img src={youtubeIcon} alt="icon" />
											YouTube
										</Link>
									</div>
								</div>
							</div>
							<div className={style.footerTop__subcolumn}>
								<h4 className={style.footerTop__title}>
									OPENING TIME
								</h4>
								<div className={style.footerTop__itemsList}>
									<div className={`${style.footerTop__item}  ${style.footerTop__item_withIcon}`}>
										<img src={clockIcon} alt='icon' />
										Monday-Friday: 8:30 am - 9:30 pm Sat-Sun: 9:00 am - 10:00 pm
									</div>	
								</div>
								<h4 className={style.footerTop__title}>
									PAYMENT OPTIONS
								</h4>
								<div className={style.footerTop__options}>
									<img src={paymentIcon1} alt="paymentMethod" />
									<img src={paymentIcon2} alt="paymentMethod" />
									<img src={paymentIcon3} alt="paymentMethod" />
									<img src={paymentIcon4} alt="paymentMethod" />
									<img src={paymentIcon5} alt="paymentMethod" />
									<img src={paymentIcon6} alt="paymentMethod" />
									<img src={paymentIcon7} alt="paymentMethod" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className={style.footerBottom}>
				<div className="content">
					<div className={style.footerBottom__body}>
						<Links className={style.footerBottom__links} links={footerLinks} />
						<div className={style.footerBottom__copyright}>
							© 2016 PSDFreebies.com | All Rights Reserved
						</div>
					</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer;