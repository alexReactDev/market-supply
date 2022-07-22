import { FC } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import CollectionsAndCategoriesHoc from "../../hocs/collectionsAndCategoriesHoc";
import Aside from "../Aside";
import Cart from "../Cart";
import Categories from "../Categories";
import Checkout from "../Checkout";
import DeleteAccount from "../DeleteAccount";
import EditEmail from "../EditEmail";
import EditPassword from "../EditPassword";
import EditProfile from "../EditProfile";
import HomePage from "../HomePage";
import Login from "../Login";
import MyAccount from "../MyAccount";
import ProductDetails from "../ProductDetails";
import SearchPage from "../SearchPage";
import SignUp from "../SignUp";
import Whitelist from "../Whitelist";
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
							<Route path="/collections/" component={CollectionsAndCategoriesHoc} />
							<Route path="/categories/*/*" component={CollectionsAndCategoriesHoc} />
							<Route path="/product" component={ProductDetails} />
							<Route path="/cart" component={Cart} />
							<Route path="/checkout" component={Checkout} />
							<Route path="/whitelist" component={Whitelist} />
							<Route path="/login" component={Login} />
							<Route path="/sign-up" component={SignUp} />
							<Route path="/account" exact component={MyAccount} />
							<Route path="/account/edit-profile" component={EditProfile} />
							<Route path="/account/edit-email" component={EditEmail} />
							<Route path="/account/edit-password" component={EditPassword} />
							<Route path="/account/delete" component={DeleteAccount} />
							<Route path="/search" component={SearchPage} />
							<Redirect from="*" to="/404" />
						</Switch>
					</div>	
				</div>
			</div>
		</main>
	)
}

export default Main;