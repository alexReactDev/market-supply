import { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { useAppDispatch } from "../../hooks";
import { initialize } from "../../redux/actions";
import { initialized as initializedSelector } from "../../redux/selectors";
import ErrorPage from "../ErrorPage";
import Footer from "../Footer";
import Header from "../Header";
import Loader from "../Loader";
import Main from "../Main";
import NotFound from "../NotFound";
import Partners from "../Partners";
import style from './app.module.scss';

const App: FC<{}> = () => {

	const initialized = useSelector(initializedSelector);
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(initialize())
	}, [])

	if(!initialized) return <Loader />

	return(
		<div className={style.wrapper}>
			<div className={style.wrapper__body}>
				<Header />
				<Switch>
					<Route path="/error" exact component={ErrorPage} />
					<Route path="/404" exact component={NotFound} />
					<Route path="*" component={Main} />
				</Switch>
			</div>
			<div className={style.wrapper__basement}>
				<Partners />
				<Footer />
			</div>
		</div>
	)
}

export default App;