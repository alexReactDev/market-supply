import { FC } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Aside from "../Aside";
import Cart from "../Cart";
import Categories from "../Categories";
import HomePage from "../HomePage";
import NotFound from "../NotFound";
import ProductDetails from "../ProductDetails";
import style from './main.module.scss';

const Main: FC<{}> = () => {
	return(
		<main className={style.main}>
			<div className="content">
				<div className={style.main__body}>
					<Aside className={style.main__aside} />
					<div className={style.main__content}>
						<Switch>
							<Route path="/" exact component={HomePage} />
							<Route path="/categories" component={Categories} />
							<Route path="/product" component={ProductDetails} />
							<Route path="/cart" component={Cart} />
							<Route path="/404" component={NotFound} />
							<Redirect from="*" to="/404" />
						</Switch>
					</div>	
				</div>
			</div>
		</main>
	)
}

export default Main;