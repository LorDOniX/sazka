import { useEffect } from "react";

import { myUseState } from "~/hooks/myUseState";
import { generateLines, getClassName } from "~/utils/utils";

import "./style.less";

interface IState {
	selected: Array<number>;
}

interface INumberTable {
	min: number;
	max: number;
	perLine: number;
	selected?: Array<number>;
	lotteryNumbers?: Array<number>;
	selectCount?: number;
	onSelect?: (numbers: Array<number>) => void;
}

export default function NumberTable({
	min,
	max,
	perLine,
	selected = [],
	lotteryNumbers = [],
	selectCount = 0,
	onSelect = () => {},
}: INumberTable) {
	const { state, updateState } = myUseState<IState>({
		selected: [],
	});
	const lines = generateLines(min, max, perLine);

	function getItemClass(value: number) {
		const isSelected = state.selected.includes(value);
		const isLotteryNumber = lotteryNumbers.includes(value);
		const background = (isSelected && lotteryNumbers.length === 0) || (isSelected && isLotteryNumber) ? "green-bg" : "red-bg";

		return getClassName([
			"numberTable__item",
			isSelected || isLotteryNumber ? background : "",
		]);
	}

	function itemClick(value: number) {
		if (selectCount > 0) {
			const newSelected = state.selected.slice();
			const ind = newSelected.findIndex(item => item === value);

			if (ind === -1 && newSelected.length === selectCount) {
				return;
			}

			if (ind === -1) {
				newSelected.push(value);
			} else {
				newSelected.splice(ind, 1);
			}

			updateState({
				selected: newSelected,
			});
			onSelect(newSelected);
		}
	}

	useEffect(() => {
		updateState({
			selected,
		});
	}, [selected]);

	return <div className="numberTable">
		{ lines.map(lineItem => <div key={lineItem.id} className="numberTable__items">
			{ lineItem.items.map(item => <div key={item.value} className={getItemClass(item.value)} onClick={() => itemClick(item.value)} data-columns={perLine}>
				<span>
					{ item.value }
				</span>
			</div>) }
		</div>) }
	</div>;
}
