import { FC } from "react";
import style from './search.module.scss';

interface IProps {
	className?: string
}

const Search: FC<IProps> = ({ className='' }) => {
	return (
		<div className={`${className} ${style.search}`}>
			<div className={style.search__field}>
				<input className={style.search__input} type='search' placeholder="Search here..." />
			</div>
			<div className={style.search__controls}>
				<input className={style.search__button} type='button' />
			</div>
		</div>
	)
}

export default Search;