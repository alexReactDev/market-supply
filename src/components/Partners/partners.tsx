import { FC } from "react";
import style from './partners.module.scss';

import partner1Logo from '../../images/partners/0.png';
import partner2Logo from '../../images/partners/1.png';
import partner3Logo from '../../images/partners/2.png';
import partner4Logo from '../../images/partners/3.png';
import partner5Logo from '../../images/partners/4.png';
import partner6Logo from '../../images/partners/0.png';

const Partners: FC<{}> = () => {
	return(
		<div className={style.partners} >
			<div className={"content"}>
				<div className={style.partners__body}>
					<ul className={style.partners__list}>
						<li className={style.partners__partner}>
							<img className={style.partners__img} src={partner1Logo} alt="partner" />
						</li>
						<li className={style.partners__partner}>
							<img className={style.partners__img} src={partner2Logo} alt="partner" />
						</li>
						<li className={style.partners__partner}>
							<img className={style.partners__img} src={partner3Logo} alt="partner" />
						</li>
						<li className={style.partners__partner}>
							<img className={style.partners__img} src={partner4Logo} alt="partner" />
						</li>
						<li className={style.partners__partner}>
							<img className={style.partners__img} src={partner5Logo} alt="partner" />
						</li>
						<li className={style.partners__partner}>
							<img className={style.partners__img} src={partner6Logo} alt="partner" />
						</li>
					</ul>
				</div>
			</div>
		</div>
	)
}

export default Partners;