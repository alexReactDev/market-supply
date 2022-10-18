import { FC } from "react";
import { Link } from "react-router-dom";
import style from './links.module.scss';

interface IProps {
	className?: string,
	links: {
		link: string,
		text: string
	}[]
}

const Links: FC<IProps> = ({ className='', links }) => {
	return(
		<ul className={`${className} ${style.links}`}>
			{
				links.map((link) => {
					return(
						<li className={style.links__link} key={link.link} >
							<Link className={`${style.links__linkText} nav-link`} to={link.link}>
								{link.text}
							</Link>
						</li>
					)
				})
			}
		</ul>
	)
}

export default Links;