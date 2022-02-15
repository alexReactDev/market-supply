import { FC } from "react";
import Footer from "../Footer";
import Header from "../Header";
import Main from "../Main";
import style from './app.module.scss';

const App: FC<{}> = () => {

	return(
		<div className={style.wrapper}>
			<div className={style.wrapper__body}>
				<Header />
				<Main />
			</div>
			<div className={style.wrapper__basement}>
				<Footer />
			</div>
		</div>
	)
}

export default App;