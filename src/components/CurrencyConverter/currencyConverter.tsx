import { FC } from "react";

interface IProps {
	value: number
}

const CurrencyConverter: FC<IProps> = ({ value }) => {
	return(
		<>
		{`$ ${value.toFixed(2)}`}
		</>
	)
}

export default CurrencyConverter;