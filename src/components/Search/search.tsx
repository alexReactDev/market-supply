import { useFormik } from "formik";
import { FC, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { searchRequestAction } from "../../redux/actions";
import { searchSelector } from "../../redux/selectors";
import style from './search.module.scss';

interface IProps {
	className?: string
}

const Search: FC<IProps> = ({ className='' }) => {

	const dispatch = useAppDispatch();
	const search = useAppSelector(searchSelector);

	const formik = useFormik({
		initialValues: {
			search: ""
		},
		onSubmit(values) {
			dispatch(searchRequestAction(values.search));
		}
	})

	useEffect(() => {
		if(search.loaded) formik.setFieldValue("search", "");
	}, [search.loaded])

	useEffect(() => {
		if(search.search && search.loading) formik.setFieldValue("search", search.search);
	}, [search.search, search.loading])

	return (
		<form className={`${className} ${style.search}`} onSubmit={formik.handleSubmit} >
			<div className={style.search__field}>
				<input 
					className={style.search__input} 
					type='search' 
					name="search"
					id="search"
					placeholder="Search here..."
					value={formik.values.search}
					onChange={formik.handleChange}
				/>
				<div className={style.search__loader} hidden={!search.loading} />
			</div>
			<div className={style.search__controls}>
				<input 
					className={style.search__button} 
					type='submit'
					value=""
				/>
			</div>
		</form>
	)
}

export default Search;