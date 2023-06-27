import { DEFAULT_AMOUNT, RYCHLA6, RYCHLE_KACKY, SPORTKA, STISTKO } from "~/const";
import { ITableLineItem, ITableItem, IBet, IBetInfo, ILotteryItem, ISportkaData, ISportkaColumnPrice, ISportkaColumn, ISportka, IStistkoData, NumWithProb, TStistkoVariant,
	TStistkoVariantConfig, IRychla6Lottery } from "~/interfaces";
// obrazky
import RychleKackyImg from "~/assets/sazka/rychleKacky.jpg";
import Rychla6Img from "~/assets/sazka/rychla6.jpg";
import SportkaImg from "~/assets/sazka/sportka.jpg";

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

function getRandomArbitrary(min: number, max: number) {
	return (Math.random() * (max - min)) + min;
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

export function getBetInfo(bet: IBet) {
	let output: IBetInfo = {
		gameTitle: "",
		imgSrc: null,
		title: "",
		desc: "",
		date: formatDate(bet.state === "completed" ? bet.completeDate : bet.date),
		dateTitle: bet.state === "completed" ? "Slosováno" : "Slosování",
		winPrice: bet.state === "new"
			? ""
			: bet.winPrice > 0 ? `Výhra ${formatPrice(bet.winPrice)}` : "-",
	};

	switch (bet.type) {
		case "rychle-kacky":
			output = {
				...output,
				gameTitle: "Rychlé kačky",
				imgSrc: RychleKackyImg,
				title: formatColumns(1),
				desc: bet.rychleKacky.drawCount === 1
					? "1 slosování"
					: bet.state === "progress"
						? `Slosování ${bet.rychleKacky.lotteries.length} / ${bet.rychleKacky.drawCount}`
						: "Předplatné",
			};
			break;

		case "rychla6":
			output = {
				...output,
				gameTitle: "Rychlá 6",
				imgSrc: Rychla6Img,
				title: formatColumns(1),
				desc: bet.rychla6.drawCount === 1
					? "1 slosování"
					: bet.state === "progress"
						? `Slosování ${bet.rychla6.lotteries.length} / ${bet.rychla6.drawCount}`
						: "Předplatné",
			};
			break;

		case "sportka":
			output = {
				...output,
				gameTitle: "Sportka",
				imgSrc: SportkaImg,
				title: "Sportka",
				desc: formatColumns(bet.sportka.columns.length),
			};
			break;

		default:
	}

	return output;
}

export function generateRychleKacky(guessedNumbers: number) {
	return getRandomList(RYCHLE_KACKY.min, RYCHLE_KACKY.max, guessedNumbers, true);
}

export function generateSportkaColumn() {
	return getRandomList(SPORTKA.min, SPORTKA.max, SPORTKA.guessedNumbers, true);
}

export function generateSportkaChance() {
	return getRandomList(SPORTKA.chanceMin, SPORTKA.chanceMax, SPORTKA.guessedNumbersChance);
}

export function generateSportkaGame(columnsLen: number, hasChance: boolean) {
	const columns: Array<ISportkaColumn> = Array.from({ length: columnsLen }).map((arrItem, ind) => ({
		guessedNumbers: generateSportkaColumn(),
		index: ind + 1,
	}));
	const chance: Array<number> = hasChance ? generateSportkaChance() : [];

	return {
		columns,
		chance,
	};
}

export function generateRychla6() {
	return getRandomList(RYCHLA6.min, RYCHLA6.max, RYCHLA6.guessedNumbers, true);
}

export function getLotteries(bet: IBet): Array<ILotteryItem> {
	switch (bet.type) {
		case "rychle-kacky":
			return bet.rychleKacky.lotteries.map((lottery, ind) => ({
				ind,
				title: `Slosování ${ind + 1}`,
				price: lottery.winPrice > 0 ? formatPrice(lottery.winPrice) : "-",
				winPrice: lottery.winPrice,
			})) as Array<ILotteryItem>;

		case "rychla6":
			return bet.rychla6.lotteries.map((lottery, ind) => ({
				ind,
				title: `Slosování ${ind + 1}`,
				price: lottery.winPrice > 0 ? formatPrice(lottery.winPrice) : "-",
				winPrice: lottery.winPrice,
			})) as Array<ILotteryItem>;

		case "sportka": {
			if (!bet.sportka.lottery) {
				return [];
			}

			const output: Array<ILotteryItem> = bet.sportka.lottery.columnsPrices.map(column => ({
				ind: column.index,
				title: `Sloupec ${column.index}`,
				price: `${formatPrice(column.price1)} | ${formatPrice(column.price2)}`,
				winPrice: column.price1 + column.price2,
			}));

			if (bet.sportka.hasChance) {
				output.push({
					ind: output.length + 1,
					title: "Šance",
					price: formatPrice(bet.sportka.lottery.chancePrice),
					winPrice: bet.sportka.lottery.chancePrice,
				});
			}

			return output;
		}

		default:
	}

	return [];
}

export function getRychleKackyNumbers(): Array<number> {
	return getRandomList(RYCHLE_KACKY.min, RYCHLE_KACKY.max, RYCHLE_KACKY.drawNumbers, true);
}

export function getSportkaData(): ISportkaData {
	// neradime
	const drawNumbers1 = getRandomList(SPORTKA.min, SPORTKA.max, SPORTKA.drawNumbers + SPORTKA.addDrawNumber);
	const drawAddOn1 = drawNumbers1.pop();
	const drawNumbers2 = getRandomList(SPORTKA.min, SPORTKA.max, SPORTKA.drawNumbers + SPORTKA.addDrawNumber);
	const drawAddOn2 = drawNumbers2.pop();
	const chance = getRandomList(SPORTKA.chanceMin, SPORTKA.chanceMax, SPORTKA.drawNumbers);

	return {
		drawNumbers1,
		drawNumbers2,
		drawAddOn1,
		drawAddOn2,
		chance,
	};
}

export function getWinPriceRychleKacky(rychleKacky: IBet["rychleKacky"], winNumbers: Array<number>) {
	const sameNumbers = getSameNumbers(rychleKacky.guessedNumbers, winNumbers);

	return RYCHLE_KACKY.priceTable[sameNumbers] * rychleKacky.bet;
}

export function getWinPriceSportka(sportka: IBet["sportka"], data: ISportkaData) {
	const columnsPrices: Array<ISportkaColumnPrice> = [];
	let columnsPrice = 0;

	// vyhodnotime sloupce
	sportka.columns.forEach(column => {
		const columnTest1 = getSameNumbers(column.guessedNumbers, data.drawNumbers1);
		const columnTest2 = getSameNumbers(column.guessedNumbers, data.drawNumbers2);
		// standard test
		let price1 = SPORTKA.priceTable[columnTest1];
		let price2 = SPORTKA.priceTable[columnTest2];

		if (sportka.superJackpot) {
			// posledni cislo sance
			const chanceLast = data.chance[SPORTKA.guessedNumbersChance - 1];
			const guessLast = sportka.guessedChance[sportka.guessedChance.length - 1];
			const chanceTest = chanceLast === guessLast;

			if (columnTest1 === SPORTKA.guessedNumbers && chanceTest) {
				price1 = SPORTKA.priceTableSpecial.sixWithChance;
			}

			if (columnTest2 === SPORTKA.guessedNumbers && chanceTest) {
				price2 = SPORTKA.priceTableSpecial.sixWithChance;
			}
		} else {
			// mame 5 cisel + 1 dodatkove
			if (columnTest1 === SPORTKA.specialPriceColumns && column.guessedNumbers.includes(data.drawAddOn1)) {
				price1 = SPORTKA.priceTableSpecial.fivePlusAddOn;
			}

			if (columnTest2 === SPORTKA.specialPriceColumns && column.guessedNumbers.includes(data.drawAddOn2)) {
				price2 = SPORTKA.priceTableSpecial.fivePlusAddOn;
			}
		}

		// ulozime
		columnsPrices.push({
			index: column.index,
			price1,
			price2,
		});
		columnsPrice += price1 + price2;
	});
	// vyhodnotime sanci
	let chancePrice = 0;

	for (let ind = SPORTKA.guessedNumbersChance; ind > 0; ind--) {
		const guessChance = sportka.guessedChance[ind - 1];
		const drawChance = data.chance[ind - 1];

		if (guessChance === drawChance) {
			chancePrice = SPORTKA.chanceTable[SPORTKA.guessedNumbersChance - ind + 1];
		} else {
			break;
		}
	}

	return {
		chancePrice,
		columnsPrices,
		columnsPrice,
	};
}
export function getDefaultAmount() {
	return isLocalDev()
		? DEFAULT_AMOUNT
		: 0;
}

export function getChanceCheck(myNumbers: Array<number>, drawNumbers: Array<number>) {
	let findInd = -1;

	for (let ind = drawNumbers.length - 1; ind >= 0; ind--) {
		const myNumber = myNumbers[ind];
		const drawNumber = drawNumbers[ind];

		if (myNumber === drawNumber) {
			findInd = ind;
		} else {
			break;
		}
	}

	return findInd;
}

export function getRychleKackyPrice(bet: number, drawCount: number) {
	return bet * drawCount;
}

export function getRychla6Price(bet: number, drawCount: number) {
	return bet * drawCount;
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

export function getSportkaPriceData(colLen: number, hasChance: boolean): Pick<ISportka, "hasChance" | "price" | "superJackpot"> {
	const price = (colLen * SPORTKA.pricePerColumn) + (hasChance ? SPORTKA.chancePrice : 0);
	const superJackpot = colLen === SPORTKA.maxColumns && hasChance;

	return {
		hasChance,
		price,
		superJackpot,
	};
}

export function getStistkoConfig(variant: TStistkoVariant): TStistkoVariantConfig {
	switch (variant) {
		case "stistko10":
			return STISTKO.variant10;

		case "stistko20":
			return STISTKO.variant20;

		default:
	}

	return STISTKO.variant5;
}

export function generateStistkoData(variant: TStistkoVariant): IStistkoData {
	const prices: Array<number> = [];
	const config = getStistkoConfig(variant);
	const maxPrice = config.prices[config.prices.length - 1].value;
	let winNumber = 0;
	let winMul = getRandomFromProbList(config.muls);

	for (let ind = 0; ind < STISTKO.numbers; ind++) {
		/* eslint-disable no-constant-condition */
		while (true) {
			const price = getRandomFromProbList(config.prices);
			const priceCount = prices.filter(item => item === price).length;

			// max 3x
			if (priceCount === STISTKO.same) {
				winNumber = price;
				continue;
			}

			prices.push(price);
			break;
		}
	}

	if (winNumber > 0 && winMul * winNumber > maxPrice) {
		winMul = maxPrice / winNumber >>> 0;
	}

	return {
		prices,
		winNumber,
		winPrice: winNumber * winMul,
		winMul,
	};
}

export function getWinDataRychla6(rychla6: IBet["rychla6"], winNumbers: Array<Array<number>>): IRychla6Lottery {
	let lotteryNumbers = [];
	const isMaxMul = rychla6.bet >= RYCHLA6.priceRangeMax[0];
	let winPrice = 0;
	let winIndex = 0;

	for (let ind = 0, max = winNumbers.length; ind < max; ind++) {
		lotteryNumbers = [
			...lotteryNumbers,
			...winNumbers[ind],
		];

		const same = getSameNumbers(rychla6.guessedNumbers, lotteryNumbers);

		if (same === RYCHLA6.guessedNumbers) {
			// vyhra
			const mul = isMaxMul ? RYCHLA6.priceTable[ind].mulMax : RYCHLA6.priceTable[ind].mulMin;

			winPrice = rychla6.bet * mul;
			winIndex = ind + 1;
		}
	}

	return {
		winIndex,
		winPrice,
		winNumbers: lotteryNumbers,
	};
}

export function getRychla6Numbers(): Array<Array<number>> {
	let output = [];

	for (let ind = 0, max = RYCHLA6.draws.length; ind < max; ind++) {
		output = [
			...output,
			getRandomList(RYCHLA6.min, RYCHLA6.max, RYCHLA6.draws[ind], true),
		];
	}

	return output;
}
