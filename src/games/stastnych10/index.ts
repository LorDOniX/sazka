import { IBet, IBetInfo, ILotteryItem } from "~/interfaces";
import { formatColumns, formatPrice, generateChance, getRandomList, getSameNumbers } from "~/utils/utils";
import { sazkaStore } from "~/stores/sazka";
import { STASTNYCH10 } from "./const";
import { IStastnych10, IStastnych10Column, IStastnych10ColumnPrice, IStastnych10Data, IStastnych10GeneratedData, IStastnych10QuickItem } from "./interfaces";

import Statsnych10Img from "~/assets/sazka/stastnych10.jpg";

export function getStastnych10Cover(): any {
	return Statsnych10Img;
}

export function getStastnych10BetInfo(bet: IBet): Partial<IBetInfo> {
	return {
		gameTitle: "Šťastných 10",
		imgSrc: getStastnych10Cover(),
		title: "Šťastných 10",
		desc: formatColumns(bet.stastnych10.columns.length),
	};
}

export function generateStastnych10Column(count: number) {
	return getRandomList(STASTNYCH10.min, STASTNYCH10.max, count, true);
}

export function generateStastnych10Chance() {
	return generateChance(STASTNYCH10.chanceMin, STASTNYCH10.chanceMax, STASTNYCH10.guessedNumbersChance);
}

export function generateStastnych10Game(count: number, bet: number, kingGame: boolean, columnsLen: number, hasChance: boolean): IStastnych10GeneratedData {
	const columns: Array<IStastnych10Column> = Array.from({ length: columnsLen }).map((arrItem, ind) => ({
		guessedNumbers: generateStastnych10Column(count),
		index: ind + 1,
		bet,
		kingGame,
		price: 0,
	}));
	const chance: Array<number> = hasChance ? generateStastnych10Chance() : [];

	return {
		columns,
		chance,
	};
}

export function getStastnych10Lotteries(bet: IBet): Array<ILotteryItem> {
	if (!bet.stastnych10.lottery) {
		return [];
	}

	const output: Array<ILotteryItem> = bet.stastnych10.lottery.columnsPrices.map(column => ({
		ind: column.index,
		title: `Sloupec ${column.index}`,
		price: formatPrice(column.price),
		winPrice: column.price,
	}));

	if (bet.stastnych10.hasChance) {
		output.push({
			ind: output.length + 1,
			title: "Šťastných 10",
			price: formatPrice(bet.stastnych10.lottery.chancePrice),
			winPrice: bet.stastnych10.lottery.chancePrice,
		});
	}

	return output;
}

export function getStastnych10Data(): IStastnych10Data {
	// neradime
	const drawNumbers = getRandomList(STASTNYCH10.min, STASTNYCH10.max, STASTNYCH10.drawNumbers);
	const chance = generateStastnych10Chance();

	return {
		drawNumbers,
		chance,
		kingNumber: drawNumbers[0],
	};
}

// count - pocet hadanych cisel
// correct - pocet spravnych cisel
function getPriceRatio(count: number, correct: number, kingGame?: boolean) {
	const lineSource = kingGame ? STASTNYCH10.priceTableKing[count] : STASTNYCH10.priceTable[count];
	const ratio = lineSource ? lineSource[correct] || 0 : 0;

	return ratio;
}

export function getWinPriceStastnych10(stastnych10: IBet["stastnych10"], data: IStastnych10Data) {
	const columnsPrices: Array<IStastnych10ColumnPrice> = [];
	let columnsPrice = 0;

	// vyhodnotime sloupce
	stastnych10.columns.forEach(column => {
		const sameNumbers = getSameNumbers(column.guessedNumbers, data.drawNumbers);
		const isKingGame = column.kingGame && column.guessedNumbers.includes(data.kingNumber);
		const price = getPriceRatio(column.guessedNumbers.length, sameNumbers, isKingGame) * column.bet;

		// ulozime
		columnsPrices.push({
			index: column.index,
			price,
		});
		columnsPrice += price;
	});
	// vyhodnotime sanci
	let chancePrice = 0;

	for (let ind = STASTNYCH10.guessedNumbersChance; ind > 0; ind--) {
		const guessChance = stastnych10.guessedChance[ind - 1];
		const drawChance = data.chance[ind - 1];

		if (guessChance === drawChance) {
			chancePrice = STASTNYCH10.chanceTable[STASTNYCH10.guessedNumbersChance - ind + 1];
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

export function getStastnych10PriceData(columns: Array<IStastnych10Column>, hasChance: boolean): Pick<IStastnych10, "hasChance" | "price"> {
	const price = columns.reduce((acc, item) => acc + (item.bet * (item.kingGame ? STASTNYCH10.kingGamePriceRatio : 1)), 0) + (hasChance ? STASTNYCH10.chancePrice : 0);

	return {
		hasChance,
		price,
	};
}

export function gameStastnych10(columns: Array<IStastnych10Column>, guessedChance: IStastnych10["guessedChance"]): string {
	const store = sazkaStore.getState();
	const priceData = getStastnych10PriceData(columns, guessedChance.length > 0);

	store.addBet(priceData.price);
	store.addStastnych10({
		...priceData,
		columns,
		guessedChance,
	});

	return `Hra Šťastných 10 za ${priceData.price}, ${priceData.hasChance ? "šance" : "bez šance"}, ${formatColumns(columns.length)}`;
}

export function allInStastnych10(times: number, count: number, bet: number, kingGame: boolean, columns: Array<IStastnych10Column>, hasChance: boolean): string {
	const priceData = getStastnych10PriceData(columns, hasChance);

	for (let ind = 0; ind < times; ind++) {
		const stastnych10 = generateStastnych10Game(count, bet, kingGame, columns.length, hasChance);

		gameStastnych10(stastnych10.columns, stastnych10.chance);
	}

	return `All in Štastných 10 za ${formatPrice(priceData.price * times)}, her ${times}, ${formatColumns(columns.length)}`;
}

export function completeStastnych10(betId: IBet["id"], stastnych10: IBet["stastnych10"], data: IStastnych10Data) {
	const store = sazkaStore.getState();
	const stastnych10Price = getWinPriceStastnych10(stastnych10, data);

	store.completeStastnych10(betId, {
		...stastnych10Price,
		...data,
	});

	return stastnych10Price.columnsPrice + stastnych10Price.chancePrice;
}

export function getStastnych10QuickItems(): Array<IStastnych10QuickItem> {
	function generatePriceLine(count: number, bet: number, kingGame: boolean): Array<IStastnych10Column> {
		return Array.from({ length: count }).map(() => ({
			bet,
			index: 0,
			guessedNumbers: [],
			kingGame,
			price: 0,
		}));
	}

	const SECOND_COLUMNS = 2;
	const MAX_BET = STASTNYCH10.pricesPerColumn[STASTNYCH10.pricesPerColumn.length - 1];

	return [{
		id: 0,
		columns: STASTNYCH10.maxColumns,
		count: STASTNYCH10.maxDrawCount,
		kingGame: true,
		bet: STASTNYCH10.pricesPerColumn[0],
		chance: true,
		title: "Šance na miliony",
		line1: "4 x 10 čísel",
		line2: "Včetně Šance milion a Královské hry",
		price: getStastnych10PriceData(generatePriceLine(STASTNYCH10.maxColumns, STASTNYCH10.pricesPerColumn[0], true), true).price,
	}, {
		id: 1,
		columns: SECOND_COLUMNS,
		count: STASTNYCH10.maxDrawCount,
		kingGame: true,
		bet: STASTNYCH10.pricesPerColumn[0],
		chance: true,
		title: "Šance na miliony",
		line1: `${SECOND_COLUMNS}x 10 čísel`,
		line2: "Včetně Šance milion a Královské hry",
		price: getStastnych10PriceData(generatePriceLine(SECOND_COLUMNS, STASTNYCH10.pricesPerColumn[0], true), true).price,
	}, {
		id: 2,
		columns: 1,
		count: STASTNYCH10.maxDrawCount,
		kingGame: true,
		bet: STASTNYCH10.pricesPerColumn[0],
		chance: true,
		title: "Sloupek s Královskou",
		line1: "10 čísel",
		line2: "Včetně Šance milion a Královské hry",
		price: getStastnych10PriceData(generatePriceLine(1, STASTNYCH10.pricesPerColumn[0], true), true).price,
	}, {
		id: 3,
		columns: 1,
		count: STASTNYCH10.maxDrawCount,
		kingGame: false,
		bet: STASTNYCH10.pricesPerColumn[0],
		chance: true,
		title: "Na zkoušku",
		line1: "10 čísel",
		line2: "Včetně Šance milion",
		price: getStastnych10PriceData(generatePriceLine(1, STASTNYCH10.pricesPerColumn[0], false), true).price,
	}, {
		id: 4,
		columns: STASTNYCH10.maxColumns,
		count: STASTNYCH10.maxDrawCount,
		kingGame: true,
		bet: STASTNYCH10.pricesPerColumn[2],
		chance: true,
		title: "V ceně sportky",
		line1: "4 x 10 čísel",
		line2: "Včetně Šance milion a Královské hry",
		price: getStastnych10PriceData(generatePriceLine(STASTNYCH10.maxColumns, STASTNYCH10.pricesPerColumn[2], true), true).price,
	}, {
		id: 5,
		columns: STASTNYCH10.maxColumns,
		count: STASTNYCH10.maxDrawCount,
		kingGame: true,
		bet: MAX_BET,
		chance: true,
		title: "Max",
		line1: "10 čísel",
		line2: "Včetně Šance milion a Královské hry",
		price: getStastnych10PriceData(generatePriceLine(STASTNYCH10.maxColumns, MAX_BET, true), true).price,
	}];
}
