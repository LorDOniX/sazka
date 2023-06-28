import { useEffect, KeyboardEvent } from "react";

import { myUseState } from "~/hooks/myUseState";
import { KEYS } from "~/const";

import "./style.less";

interface IMyInputNumber {
	value: number;
	onChange?: (value: number) => void;
	onEnter?: () => void;
}

interface IState {
	value: string;
}

export default function MyInputNumber({
	value,
	onChange = () => {},
	onEnter = () => {},
}: IMyInputNumber) {
	const { state, updateState } = myUseState<IState>({
		value: value.toString(),
	});

	function updateValue(strValue: string) {
		const number = parseFloat(strValue);

		if (isNaN(number)) {
			updateState({
				value: "",
			});
			onChange(0);
		} else {
			updateState({
				value: number.toString(),
			});
			onChange(number);
		}
	}

	function onKeyDown(event: KeyboardEvent) {
		if (event.code === KEYS.ENTER) {
			onEnter();
		}
	}

	useEffect(() => {
		updateState({
			value: value.toString(),
		});
	}, [value]);

	return <div className="myInputNumber">
		<input type="text" value={state.value === "0" ? "" : state.value} onChange={event => updateValue(event.target.value)} className="myInputNumber__input" onKeyDown={onKeyDown} />
	</div>;
}
