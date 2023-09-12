/* eslint-disable no-magic-numbers */
import { getClassName } from "~/utils/utils";

import "./style.less";

interface IDice {
	value: number;
	selected?: boolean;
	selectedWin?: boolean;
	onClick?: (value: number) => void;
}

const dotPositionMatrix = {
	1: [
		[50, 50],
	],
	2: [
		[20, 20],
		[80, 80],
	],
	3: [
		[20, 20],
		[50, 50],
		[80, 80],
	],
	4: [
		[20, 20],
		[20, 80],
		[80, 20],
		[80, 80],
	],
	5: [
		[20, 20],
		[20, 80],
		[50, 50],
		[80, 20],
		[80, 80],
	],
	6: [
		[20, 20],
		[20, 80],
		[50, 20],
		[50, 80],
		[80, 20],
		[80, 80],
	],
};

export default function Dice({
	value,
	selected,
	selectedWin,
	onClick = () => {},
} :IDice) {
	const dots = dotPositionMatrix[value];

	function onDiceClick() {
		onClick(value);
	}

	/* eslint-disable react/no-array-index-key */
	return <div className={getClassName(["dice", selected ? "selected" : "", selectedWin ? "selectedWin" : ""])} onClick={onDiceClick}>
		{ dots.map((dotsItem, ind) => <div className="dice-dot" style={{ "--top": `${dotsItem[0]}%`, "--left": `${dotsItem[1]}%` }} key={ind} />) }
	</div>;
}
