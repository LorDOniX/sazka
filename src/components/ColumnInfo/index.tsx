import { getClassName, getRandomHexHash } from "~/utils/utils";
import { getChanceCheck } from "~/games/sportka";
import { notificationStore } from "~/stores/notification";

import "./style.less";

interface IColumnInfo {
	numbers: Array<number>;
	drawNumbers: Array<number>;
	drawAddOn?: number;
	type?: "column" | "chance";
	className?: string;
	onClick?: () => void;
	showCopy?: boolean;
}

export default function ColumnInfo({
	numbers = [],
	drawNumbers = [],
	drawAddOn = 0,
	type = "column",
	className = "",
	onClick = () => {},
	showCopy,
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

	function copyClick() {
		navigator.clipboard.writeText(numbers.join(", "));
		notificationStore.getState().setNotification("Čísla zkopírovány");
	}

	return <div className={getClassName(["columnInfo", className])} onClick={() => onClick()}>
		{ numbers.map((item, ind) => <div key={getRandomHexHash()} className={getItemClass(item, ind)}>
			<span>
				{ item }
			</span>
		</div>) }
		{ showCopy && <span className="columnInfo__copyBtn" dangerouslySetInnerHTML={{ __html: "&#128203" }} title="Zkopírovat čísla" onClick={copyClick} /> }
	</div>;
}
