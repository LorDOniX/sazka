import { getClassName, getRandomHexHash } from "~/utils/utils";
import { getChanceCheck } from "~/games/sportka";

import "./style.less";

interface IColumnInfo {
	numbers: Array<number>;
	drawNumbers: Array<number>;
	drawAddOn?: number;
	type?: "column" | "chance";
	className?: string;
	onClick?: () => void;
}

export default function ColumnInfo({
	numbers = [],
	drawNumbers = [],
	drawAddOn = 0,
	type = "column",
	className = "",
	onClick = () => {},
}: IColumnInfo) {
	// test-ind 0-n
	const chanceCheck = getChanceCheck(numbers, drawNumbers);

	function getItemClass(value: number, ind: number) {
		return getClassName([
			"columnInfo__item",
			...type === "column"
				? [
					drawNumbers.includes(value) ? "drawed-number" : "",
					drawAddOn === value ? "drawed-addon" : "",
				]
				: [],
			...type === "chance"
				? [
					chanceCheck !== -1 && ind >= chanceCheck ? "drawed-chance" : "",
				]
				: [],
		]);
	}

	return <div className={getClassName(["columnInfo", className])} onClick={() => onClick()}>
		{ numbers.map((item, ind) => <div key={getRandomHexHash()} className={getItemClass(item, ind)}>
			<span>
				{ item }
			</span>
		</div>) }
	</div>;
}
