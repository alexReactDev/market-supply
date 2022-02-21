import { FC } from "react";
import { Link } from "react-router-dom";
import Banner from "../Banner";
import style from "./notFound.module.scss";

import notFoundPicture from "../../images/404/404.png";

const NotFound: FC<{}> = () => {
	return(
		<div className="content">
			<div className={style.notFound}>
				<Banner src={notFoundPicture} className={style.notFound__banner} />
				<p className="text-center">
					<Link to="/">
						Get back to homepage
					</Link>
				</p>
			</div>	
		</div>
	)
}

export default NotFound;