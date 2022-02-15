import { FC } from "react";

interface IPrpops {
	className?: string
}

const Aside: FC<IPrpops> = ({ className='' }) => {
	return (
		<aside className={className}>
			Aside
		</aside>
	)
}

export default Aside;