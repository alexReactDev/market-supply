import { FC } from "react";
import style from './app.module.scss';

const App: FC<{}> = () => {
	return(
		<div className={style.wrapper}>
			<div className={style.wrapper__body}>
				<Header />
				<TopNav />
				<Main />
			</div>
			<div className={style.wrapper__basement}>
				<FirstFooter />
				<SecondFooter />
			</div>
		</div>
	)
}

export default App;