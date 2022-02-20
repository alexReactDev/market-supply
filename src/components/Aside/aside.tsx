import { FC } from "react";
import AsideNav from "../AsideNav";
import style from "./aside.module.scss";
import banner from "../../images/banners/1.jpg";
import Banner from "../Banner";
import Newsletter from "../Newsletter";
interface IPrpops {
	className?: string
}

const Aside: FC<IPrpops> = ({ className='' }) => {
	return (
		<aside className={`${className} ${style.aside}`}>
			<AsideNav className={style.aside__item} />
			<Newsletter className={style.aside__item} />
			<Banner className={style.aside__item} src={banner} />
		</aside>
	)
}

export default Aside;