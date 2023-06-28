import { KeyboardEvent } from "react";

import { KEYS } from "~/const";

import "./style.less";

interface IMyInputNumber {
	value: number;
	onChange?: (value: number) => void;
	onEnter?: () => void;
}

export default function MyInputNumber({
	value,
	onChange = () => {},
	onEnter = () => {},
}: IMyInputNumber) {
	function updateValue(strValue: string) {
		const number = parseFloat(strValue);

		if (isNaN(number)) {
			onChange(0);
		} else {
			onChange(number);
		}
	}

	function onKeyDown(event: KeyboardEvent) {
		if (event.code === KEYS.ENTER) {
			onEnter();
		}
	}

	return <div className="myInputNumber">
		<input type="text" value={value.toString() === "0" ? "" : value.toString()} onChange={event => updateValue(event.target.value)} className="myInputNumber__input" onKeyDown={onKeyDown} />
	</div>;
}
