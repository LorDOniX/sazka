import { useEffect } from "react";

import MyInputNumber from "~/my/MyInputNumber";
import MyButton from "~/my/MyButton";
import { myUseState } from "~/hooks/myUseState";

import "./style.less";

interface IMyNumberWithSet {
	text: string;
	value: number;
	min: number;
	updatedValue: number;
	onChange?: (value: number) => void;
}

interface IState {
	value: number;
}

export default function MyNumberWithSet({
	text,
	value,
	min,
	updatedValue,
	onChange = () => {},
}: IMyNumberWithSet) {
	const { state, updateState } = myUseState<IState>({
		value,
	});

	function onNumberChange(newValue: number) {
		updateState({
			value: newValue,
		});
		onChange(newValue);
	}

	function onAdd() {
		const newValue = state.value + updatedValue;

		onNumberChange(newValue);
	}

	function onDec() {
		const newValue = Math.max(min, state.value - updatedValue);

		onNumberChange(newValue);
	}

	useEffect(() => {
		updateState({
			value,
		});
	}, [value]);

	return <div className="myNumberWithSet">
		<span>
			{ text }
		</span>
		<MyInputNumber value={state.value} onChange={onNumberChange} />
		<div className="myNumberWithSet__buttons">
			<MyButton text="+" onClick={onAdd} />
			<MyButton text="-" onClick={onDec} />
		</div>
	</div>;
}
