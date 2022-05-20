import { useFormik } from "formik";
import { FC, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { editProfileAction, loadUserDataAction } from "../../redux/actions";
import { editProfileDataSelector, loggedInSelector, userDataSelector } from "../../redux/selectors";
import Loader from "../Loader";
import style from "./editProfile.module.scss";

const EditProfile: FC<{}> = () => {

	const loggedIn = useAppSelector(loggedInSelector);
	const userData = useAppSelector(userDataSelector);
	const data = useAppSelector(editProfileDataSelector);

	const dispatch = useAppDispatch();

	useEffect(() => {
		if(loggedIn && !userData.loading && !userData.loaded && !userData.error) dispatch(loadUserDataAction());
	}, []);

	useEffect(() => {
		if(loggedIn && userData.loaded) {
			if(!formik.touched.name) formik.setFieldValue("name", profileData.name);
			if(!formik.touched.surname) formik.setFieldValue("surname", profileData.surname);
			if(!formik.touched.phone) formik.setFieldValue("phone", profileData.phone);
			if(!formik.touched.town) formik.setFieldValue("town", profileData.town);
			if(!formik.touched.street) formik.setFieldValue("street", profileData.street);
			if(!formik.touched.house) formik.setFieldValue("house", profileData.house);
			if(!formik.touched.apartment) formik.setFieldValue("apartment", profileData.apartment);
			if(!formik.touched.zip) formik.setFieldValue("zip", profileData.zip);
		}
	}, [loggedIn, userData.loaded])

	const profileData = userData.userData;

	const formik = useFormik({
		initialValues: {
			name: "",
			surname: "",
			phone: "",
			town: "",
			street: "",
			house: "",
			apartment: "",
			zip: ""
		},
		onSubmit(values) {
			dispatch(editProfileAction(values));
		}
	})

	if(!loggedIn) return <Redirect to="/login"/>
	
	if(userData.loading) return <Loader />

	if(!userData.loading && !userData.loaded && !userData.error) return <Loader />

	if(userData.error) return <Redirect to="/error"/>

	return(
		<div className={style.editProfile}>
			<h2 className={style.editProfile__title}>
				Edit profile
			</h2>
			{
				data.loading
				?
				<Loader />
				:
				null
			}
			{
				data.error
				?
				<p className={style.editProfile__errorMessage}>
					{data.error}
				</p>
				:
				null
			}
			<form className={`${style.editProfile__item} ${style.userData}`} onSubmit={formik.handleSubmit} >
				<div className={style.userData__option}>
					<input
						type="text"
						className={style.userData__input}
						id="name"
						name="name"
						placeholder="Name"
						disabled={data.loading}
						value={formik.values.name}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
					/>
				</div>
				<div className={style.userData__option}>
					<input
						type="text"
						className={style.userData__input}
						id="surnname"
						name="surnname"
						placeholder="Surname"
						disabled={data.loading}
						value={formik.values.surname}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
					/>
				</div>
				<div className={style.userData__option}>
					<input
						type="phone"
						className={style.userData__input}
						id="phone"
						name="phone"
						placeholder="Phone number"
						disabled={data.loading}
						value={formik.values.phone}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
					/>
				</div>
				<div className={style.userData__option}>
					<input
						type="text"
						className={style.userData__input}
						id="town"
						name="town"
						placeholder="Town"
						disabled={data.loading}
						value={formik.values.town}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
					/>
				</div>
				<div className={style.userData__option}>
					<input
						type="text"
						className={style.userData__input}
						id="street"
						name="street"
						placeholder="Street"
						disabled={data.loading}
						value={formik.values.street}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
					/>
				</div>
				<div className={style.userData__option}>
					<input
						type="text"
						className={style.userData__input}
						id="house"
						name="house"
						placeholder="House"
						disabled={data.loading}
						value={formik.values.house}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
					/>
				</div>
				<div className={style.userData__option}>
					<input
						type="text"
						className={style.userData__input}
						id="apartment"
						name="apartment"
						placeholder="Apartment number (If is)"
						disabled={data.loading}
						value={formik.values.apartment}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
					/>
				</div>
				<div className={style.userData__option}>
					<input
						type="text"
						className={style.userData__input}
						id="zip"
						name="zip"
						placeholder="Zip code"
						disabled={data.loading}
						value={formik.values.zip}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
					/>
				</div>
				<div className={`${style.userData__option} ${style.userData__option_big} ${style.controls}`}>
					<div className={style.controls__option}>
						<input 
							type="submit"
							className={style.editProfile__btn}
							disabled={data.loading}
							value="Confirm"
						/>
					</div>
				</div>
			</form>
		</div>
	)
}

export default EditProfile;