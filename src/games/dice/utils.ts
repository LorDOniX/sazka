/* eslint-disable no-magic-numbers */
import { TFiveDices, TFiveDicesSelection, TGameRanks } from "./interfaces";
import { sortArrayNumbers } from "~/utils/utils";
import { INIT_SEL, RANKS_START } from "./const";

interface ISameItem {
	value: number;
	count: number;
	indexes: Array<number>;
}

interface IGetRankOutput {
	rank: TGameRanks;
	diceValue: number;
	selection: TFiveDicesSelection;
}

function indexesToSelection(indexes: ISameItem["indexes"]): TFiveDicesSelection {
	const output = [...INIT_SEL] as TFiveDicesSelection;

	indexes.forEach(ind => {
		output[ind] = true;
	});

	return output;
}

export function getRank(values: TFiveDices): IGetRankOutput {
	const sortedValues = sortArrayNumbers(values.slice());
	const same: Array<ISameItem> = [];

	values.forEach((value, ind) => {
		let filtered = same.filter(item => item.value === value);

		if (filtered.length === 0) {
			const newItem: ISameItem = {
				value,
				count: 0,
				indexes: [],
			};

			filtered = [newItem];
			same.push(newItem);
		}

		filtered[0].count++;
		filtered[0].indexes.push(ind);
	});

	same.sort((aItem, bItem) => bItem.count - aItem.count);

	const sameKey = same.map(item => item.count).join("+");
	const output: IGetRankOutput = {
		rank: "nothing",
		diceValue: 0,
		selection: [...INIT_SEL] as TFiveDicesSelection,
	};

	if (sameKey === "5") {
		output.rank = "five-of-a-kind";
		output.diceValue = RANKS_START[0] + (5 * same[0].value);
		output.selection = indexesToSelection(same[0].indexes);
	} else if (sameKey === "4+1") {
		output.rank = "four-of-a-kind";
		output.diceValue = RANKS_START[1] + (4 * same[0].value);
		output.selection = indexesToSelection(same[0].indexes);
	} else if (sameKey === "3+1+1") {
		output.rank = "three-of-a-kind";
		output.diceValue = RANKS_START[5] + (3 * same[0].value);
		output.selection = indexesToSelection(same[0].indexes);
	} else if (sameKey === "3+2") {
		output.rank = "fullhouse";
		output.diceValue = RANKS_START[2] + (3 * same[0].value) + (2 * same[1].value);
		output.selection = indexesToSelection([
			...same[0].indexes,
			...same[1].indexes,
		]);
	} else if (sameKey === "2+2+1") {
		output.rank = "two-pairs";
		output.diceValue = RANKS_START[6] + (2 * same[0].value) + (2 * same[1].value);
		output.selection = indexesToSelection([
			...same[0].indexes,
			...same[1].indexes,
		]);
	} else if (sameKey === "2+1+1+1") {
		output.rank = "pair";
		output.diceValue = RANKS_START[7] + (2 * same[0].value);
		output.selection = indexesToSelection(same[0].indexes);
	} else if (sameKey === "1+1+1+1+1") {
		const diceKey = sortedValues.join("");

		if (diceKey === "12345") {
			output.rank = "five-high-straight";
			output.diceValue = RANKS_START[4] + 1 + 2 + 3 + 4 + 5;
			output.selection = [true, true, true, true, true];
		} else if (diceKey === "23456") {
			output.rank = "six-high-straight";
			output.diceValue = RANKS_START[3] + 2 + 3 + 4 + 5 + 6;
			output.selection = [true, true, true, true, true];
		} else {
			// nejvyssi cislo
			output.diceValue = RANKS_START[8] + sortedValues[4];
			output.selection = indexesToSelection([
				values.indexOf(sortedValues[4]),
			]);
		}
	}

	return output;
}

export function getPcSelection(rank: IGetRankOutput): TFiveDicesSelection {
	const orig = rank.selection.filter(item => item);

	if (orig.length === INIT_SEL.length) {
		return INIT_SEL as TFiveDicesSelection;
	}

	return rank.selection.map(value => !value) as TFiveDicesSelection;
}
