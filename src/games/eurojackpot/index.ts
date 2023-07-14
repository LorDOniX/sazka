import { IBet, IBetInfo, ILotteryItem } from "~/interfaces";
import { formatColumns, formatPrice, generateChance, getRandomList, getSameNumbers } from "~/utils/utils";
import { sazkaStore } from "~/stores/sazka";
import { EUROJACKPOT } from "./const";
import { IEurojackpot, IEurojackpotColumn, IEurojackpotColumnPrice, IEurojackpotData, IEurojackpotGeneratedData } from "./interfaces";

import EurojackpotImg from "~/assets/sazka/eurojackpot.jpg";

export function getEurojackpotCover(): any {
	return EurojackpotImg;
}

export function getEurojackpotBetInfo(bet: IBet): Partial<IBetInfo> {
	return {
		gameTitle: "Eurojackpot",
		imgSrc: getEurojackpotCover(),
		title: "Eurojackpot",
		desc: formatColumns(bet.eurojackpot.columns.length),
	};
}

export function generateEurojackpotColumn(): Pick<IEurojackpotColumn, "guessedNumbers" | "guessedSecondNumbers"> {
	return {
		guessedNumbers: getRandomList(EUROJACKPOT.min, EUROJACKPOT.max, EUROJACKPOT.guessedNumbers, true),
		guessedSecondNumbers: getRandomList(EUROJACKPOT.minSecond, EUROJACKPOT.maxSecond, EUROJACKPOT.guessedSecondNumbers, true),
	};
}

export function generateEurojackpotChance() {
	return generateChance(EUROJACKPOT.chanceMin, EUROJACKPOT.chanceMax, EUROJACKPOT.guessedNumbersChance);
}

export function generateEurojackpotGame(columnsLen: number, hasChance: boolean): IEurojackpotGeneratedData {
	const columns: Array<IEurojackpotColumn> = Array.from({ length: columnsLen }).map((arrItem, ind) => ({
		...generateEurojackpotColumn(),
		index: ind + 1,
	}));
	const chance: Array<number> = hasChance ? generateEurojackpotChance() : [];

	return {
		columns,
		chance,
	};
}

export function getEurojackpotLotteries(bet: IBet): Array<ILotteryItem> {
	if (!bet.eurojackpot.lottery) {
		return [];
	}

	const output: Array<ILotteryItem> = bet.eurojackpot.lottery.columnsPrices.map(column => ({
		ind: column.index,
		title: `Sloupec ${column.index}`,
		price: formatPrice(column.price),
		winPrice: column.price,
	}));

	if (bet.eurojackpot.hasChance) {
		output.push({
			ind: output.length + 1,
			title: "Šance",
			price: formatPrice(bet.eurojackpot.lottery.chancePrice),
			winPrice: bet.eurojackpot.lottery.chancePrice,
		});
	}

	return output;
}

export function getEurojackpotData(): IEurojackpotData {
	// neradime
	const drawNumbers = getRandomList(EUROJACKPOT.min, EUROJACKPOT.max, EUROJACKPOT.drawNumbers);
	const drawSecondNumbers = getRandomList(EUROJACKPOT.minSecond, EUROJACKPOT.maxSecond, EUROJACKPOT.secondDrawNumbers);
	const chance = generateEurojackpotChance();

	return {
		drawNumbers,
		drawSecondNumbers,
		chance,
	};
}

export function getWinPriceEurojackpot(eurojackpot: IBet["eurojackpot"], data: IEurojackpotData) {
	const columnsPrices: Array<IEurojackpotColumnPrice> = [];
	let columnsPrice = 0;

	// vyhodnotime sloupce
	eurojackpot.columns.forEach(column => {
		const firstDraw = getSameNumbers(column.guessedNumbers, data.drawNumbers);
		const secondDraw = getSameNumbers(column.guessedSecondNumbers, data.drawSecondNumbers);
		let price = 0;
		const key = `${firstDraw}+${secondDraw}`;

		if (key in EUROJACKPOT.priceTable) {
			price = EUROJACKPOT.priceTable[key];
		}

		// ulozime
		columnsPrices.push({
			index: column.index,
			price,
		});
		columnsPrice += price;
	});
	// vyhodnotime sanci
	let chancePrice = 0;

	for (let ind = EUROJACKPOT.guessedNumbersChance; ind > 0; ind--) {
		const guessChance = eurojackpot.guessedChance[ind - 1];
		const drawChance = data.chance[ind - 1];

		if (guessChance === drawChance) {
			chancePrice = EUROJACKPOT.chanceTable[EUROJACKPOT.guessedNumbersChance - ind + 1];
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

export function getEurojackpotPriceData(colLen: number, hasChance: boolean): Pick<IEurojackpot, "hasChance" | "price"> {
	const price = (colLen * EUROJACKPOT.pricePerColumn) + (hasChance ? EUROJACKPOT.chancePrice : 0);

	return {
		hasChance,
		price,
	};
}

export function gameEurojackpot(columns: Array<IEurojackpotColumn>, guessedChance: IEurojackpot["guessedChance"]): string {
	const store = sazkaStore.getState();
	const priceData = getEurojackpotPriceData(columns.length, guessedChance.length > 0);

	store.addBet(priceData.price);
	store.addEurojackpot({
		...priceData,
		columns,
		guessedChance,
	});

	return `Hra Eurojackpot za ${priceData.price}, ${priceData.hasChance ? "šance" : "bez šance"}, ${formatColumns(columns.length)}`;
}

export function allInEurojackpot(columnsLen: number, hasChance: boolean): string {
	const storeAmount = sazkaStore.getState().sazka.amount;
	const priceData = getEurojackpotPriceData(columnsLen, hasChance);
	const times = storeAmount / priceData.price >>> 0;

	for (let ind = 0; ind < times; ind++) {
		const eurojackpot = generateEurojackpotGame(columnsLen, hasChance);

		gameEurojackpot(eurojackpot.columns, eurojackpot.chance);
	}

	return `All in Eurojackpot za ${formatPrice(priceData.price * times)}, her ${times}, ${formatColumns(columnsLen)}`;
}

export function completeEurojackpot(betId: IBet["id"], eurojackpot: IBet["eurojackpot"], data: IEurojackpotData) {
	const store = sazkaStore.getState();
	const eurojackpotPrice = getWinPriceEurojackpot(eurojackpot, data);

	store.completeEurojackpot(betId, {
		...eurojackpotPrice,
		...data,
	});

	return eurojackpotPrice.columnsPrice + eurojackpotPrice.chancePrice;
}
