import { FC, MouseEvent, TouchEvent, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../hooks";
import { hidePopup } from "../../redux/reducer/popup";
import { popupSelector } from "../../redux/selectors";
import style from "./popup.module.scss";

const Popup: FC<{}> = () => {

	const popup = useSelector(popupSelector);

	const dispatch = useAppDispatch();

	useEffect(() => {
		if(popup.display) {
			setTimeout(() => dispatch(hidePopup()), 3000);
		}
	}, [popup.display])

	return (
		<div 
			className={`${style.modal} ${popup.display ? style.modal_visible : ""}`} 
			onClick={(e: MouseEvent ) => e.target === e.currentTarget ? dispatch(hidePopup()) : null}
			>
			<div className={`${style.popup} ${popup.display ? style.popup_visible : ""}`}>
				<div 
				className={style.popup__cross}
				onClick={(e: MouseEvent ) => e.target === e.currentTarget ? dispatch(hidePopup()) : null}
				onTouchMove={(e: TouchEvent ) => e.target === e.currentTarget ? dispatch(hidePopup()) : null}
				/>
				<div className={style.popup__body}>
					<p className={style.popup__message}>
						{popup.message}
					</p>
				</div>
			</div>
		</div>
	)
}

export default Popup;