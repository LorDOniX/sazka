import { DEFAULT_AMOUNT } from "~/const";
import { ITableLineItem, ITableItem, NumWithProb } from "~/interfaces";

export function loadScript(src: string) {
	return new Promise((resolve, reject) => {
		const script = document.createElement("script");

		script.type = "text/javascript";
		script.async = true;
		script.addEventListener("load", () => {
			resolve({});
		});
		script.addEventListener("error", () => {
			reject({});
		});

		script.src = src;
		document.head.appendChild(script);
	});
}

/* eslint-disable no-magic-numbers */
export function timeToSeconds(value: string): number {
	const parts = value.split(":");

	if (parts.length === 2) {
		return (parseFloat(parts[0]) * 60) + parseFloat(parts[1]);
	}

	return 0;
}

export function getRandomTicketId() {
	return Math.random() * 10e9 >>> 0;
}

export function getRandomHexHash(): string {
	return Math.random().toString(16).replace("0.", "");
}

export function getYearMonthDesc(date: Date): string {
	return new Intl.DateTimeFormat("cs", { year: 'numeric', month: 'long' }).format(date);
}

export function getFullDesc(date: Date): string {
	return new Intl.DateTimeFormat("cs", { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
}

export function getClassName(classes: Array<string>): string {
	const filtered = classes.filter(item => item.length > 0);

	return filtered.join(" ");
}

export function isLocalDev() {
	return location.href.indexOf("localhost") !== -1;
}

export function removeFromArray<T>(inputArray: Array<T>, compareFn: (value: T) => boolean): Array<T> {
	const ind = inputArray.findIndex(compareFn);

	if (ind !== -1) {
		const copiedArray = inputArray.slice();

		copiedArray.splice(ind, 1);

		return copiedArray;
	}

	return inputArray;
}


export function sortArrayNumbers(array: Array<number>): Array<number> {
	array.sort((aItem, bItem) => aItem - bItem);

	return array;
}

export function insertUnique<T>(inputArray: Array<T>, uniqueItem: T): Array<T> {
	if (inputArray.includes(uniqueItem)) {
		return inputArray;
	}

	return [
		...inputArray,
		uniqueItem,
	];
}

export function formatNumberToThousands(value: number) {
	const strValue = value.toString();
	const parts = strValue.split(".");

	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/ug, ' ');

	return parts.join(".");
}

export function formatPrice(price: number): string {
	return `${formatNumberToThousands(price)} Kč`;
}

export function formatDate(dateStr: string) {
	const date = new Date(dateStr);

	return new Intl.DateTimeFormat("cs-CZ", { dateStyle: 'full', timeStyle: 'short' }).format(date);
}

export function formatColumns(columns: number): string {
	let columnsTrans = "sloupců";

	/* eslint-disable no-magic-numbers */
	if (columns >= 2 && columns < 5) {
		columnsTrans = "sloupce";
	} else if (columns === 1) {
		columnsTrans = "sloupec";
	}

	return `${columns} ${columnsTrans}`;
}

export function getRandomArbitrary(min: number, max: number) {
	return (Math.random() * (max - min)) + min;
}

export function generateChance(min: number, max: number, len: number) {
	const list = [];

	for (let ind = 0; ind < len; ind++) {
		const newNumber = getRandomArbitrary(min, max) >>> 0;

		list.push(newNumber);
	}

	return list;
}

export function getRandomList(min: number, max: number, len: number, sort?: boolean) {
	const list = [];

	while (list.length !== len) {
		const newNumber = getRandomArbitrary(min, max) >>> 0;

		if (!list.includes(newNumber)) {
			list.push(newNumber);
		}
	}

	if (sort) {
		sortArrayNumbers(list);
	}

	return list;
}

export function getSameNumbers(guessedList: Array<number>, lotteryList: Array<number>) {
	return guessedList.filter(item => lotteryList.includes(item)).length;
}

export function generateLines(min: number, max: number, perLine: number) {
	const lines: Array<ITableLineItem> = [];
	const currentItems: Array<ITableItem> = [];

	for (let ind = min; ind <= max; ind++) {
		currentItems.push({
			value: ind,
		});

		if (currentItems.length === perLine) {
			lines.push({
				id: `line_${ind}`,
				items: [
					...currentItems,
				],
			});
			// reset
			currentItems.length = 0;
		}
	}

	if (currentItems.length) {
		lines.push({
			id: `line_${currentItems[0].value}`,
			items: [
				...currentItems,
			],
		});
	}

	return lines;
}

export function getDefaultAmount() {
	return isLocalDev()
		? DEFAULT_AMOUNT
		: 0;
}

export function getRandomFromProbList(items: Array<NumWithProb>) {
	const ranNum = Math.random() * 100 >>> 0;
	const len = items.length;
	let fromInd = 0;
	let toInd = 0;
	let findNum = -1;

	for (let ind = 0; ind < len; ind++) {
		toInd += items[ind].prob;

		if ((ranNum >= fromInd && ranNum < toInd) || ind === len - 1) {
			findNum = items[ind].value;
			break;
		}

		fromInd = toInd;
	}

	return findNum;
}

export function generateNumbersInRange(fromValue: number, toValue: number, addValue = 1) {
	const output: Array<number> = [];
	const times = (toValue - fromValue) / addValue >>> 0;

	for (let ind = 0; ind < times; ind++) {
		output.push(fromValue + (ind * addValue));
	}

	output.push(toValue);

	return output;
}
