import { IBet, IBetInfo, ILotteryItem, ISportQuickItem } from "~/interfaces";
import { formatColumns, formatPrice, generateChance, getRandomList, getSameNumbers } from "~/utils/utils";
import { sazkaStore } from "~/stores/sazka";
import { SPORTKA } from "./const";
import { ISportka, ISportkaColumn, ISportkaColumnPrice, ISportkaData, ISportkaGeneratedData } from "./interfaces";

import SportkaImg from "~/assets/sazka/sportka.jpg";

export function getSportkaCover(): any {
	return SportkaImg;
}

export function getSportkaBetInfo(bet: IBet): Partial<IBetInfo> {
	return {
		gameTitle: "Sportka",
		imgSrc: getSportkaCover(),
		title: "Sportka",
		desc: formatColumns(bet.sportka.columns.length),
	};
}

export function generateSportkaColumn() {
	return getRandomList(SPORTKA.min, SPORTKA.max, SPORTKA.guessedNumbers, true);
}

export function generateSportkaChance() {
	return generateChance(SPORTKA.chanceMin, SPORTKA.chanceMax, SPORTKA.guessedNumbersChance);
}

export function generateSportkaGame(columnsLen: number, hasChance: boolean): ISportkaGeneratedData {
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

export function generateFavouriteTicket(): ISportkaGeneratedData {
	const columns = Array.from({ length: SPORTKA.maxColumns }).map((item, ind) => {
		const guessedNumbers = SPORTKA.favouriteNumbers.columns[ind] || generateSportkaColumn();

		return {
			guessedNumbers,
			index: ind + 1,
		};
	});
	const chance: Array<number> = generateSportkaChance();

	return {
		columns,
		chance,
	};
}

export function getSportkaLotteries(bet: IBet): Array<ILotteryItem> {
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

export function getSportkaData(): ISportkaData {
	// neradime
	const drawNumbers1 = getRandomList(SPORTKA.min, SPORTKA.max, SPORTKA.drawNumbers + SPORTKA.addDrawNumber);
	const drawAddOn1 = drawNumbers1.pop();
	const drawNumbers2 = getRandomList(SPORTKA.min, SPORTKA.max, SPORTKA.drawNumbers + SPORTKA.addDrawNumber);
	const drawAddOn2 = drawNumbers2.pop();
	const chance = generateSportkaChance();

	return {
		drawNumbers1,
		drawNumbers2,
		drawAddOn1,
		drawAddOn2,
		chance,
	};
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

export function getSportkaPriceData(colLen: number, hasChance: boolean): Pick<ISportka, "hasChance" | "price" | "superJackpot"> {
	const price = (colLen * SPORTKA.pricePerColumn) + (hasChance ? SPORTKA.chancePrice : 0);
	const superJackpot = colLen === SPORTKA.maxColumns && hasChance;

	return {
		hasChance,
		price,
		superJackpot,
	};
}

export function gameSportka(columns: Array<ISportkaColumn>, guessedChance: ISportka["guessedChance"]): string {
	const store = sazkaStore.getState();
	const priceData = getSportkaPriceData(columns.length, guessedChance.length > 0);

	store.addBet(priceData.price);
	store.addSportka({
		...priceData,
		columns,
		guessedChance,
	});

	return `Hra Sportka za ${priceData.price}${priceData.superJackpot ? ", superjackpot" : ""}, ${priceData.hasChance ? "šance" : "bez šance"}, ${formatColumns(columns.length)}`;
}

export function allInSportka(times: number, columnsLen: number, hasChance: boolean): string {
	const priceData = getSportkaPriceData(columnsLen, hasChance);

	for (let ind = 0; ind < times; ind++) {
		const sportka = generateSportkaGame(columnsLen, hasChance);

		gameSportka(sportka.columns, sportka.chance);
	}

	return `All in Sportka za ${formatPrice(priceData.price * times)}${priceData.superJackpot ? ", superjackpot" : ""}, her ${times}, ${formatColumns(columnsLen)}`;
}

export function completeSportka(betId: IBet["id"], sportka: IBet["sportka"], data: ISportkaData) {
	const store = sazkaStore.getState();
	const sportkaPrice = getWinPriceSportka(sportka, data);

	store.completeSportka(betId, {
		...sportkaPrice,
		...data,
	});

	return sportkaPrice.columnsPrice + sportkaPrice.chancePrice;
}

export function getSportkaQuickItems() {
	const MIDDLE_COLUMNS = 5;
	const RIGHT_COLUMNS = 1;

	const items: Array<ISportQuickItem> = [{
		id: 0,
		columns: SPORTKA.maxColumns,
		hasSuperJackpot: true,
		chance: true,
		title: "Plný ticket",
		line1: "Hra o superjackpot",
		line2: formatColumns(SPORTKA.maxColumns),
		line3: "Včetně šance",
		price: (SPORTKA.maxColumns * SPORTKA.pricePerColumn) + SPORTKA.chancePrice,
	}, {
		id: 1,
		columns: MIDDLE_COLUMNS,
		hasSuperJackpot: false,
		chance: true,
		title: `${formatColumns(MIDDLE_COLUMNS)} a Šance`,
		line1: formatColumns(MIDDLE_COLUMNS),
		line2: "Včetně Šance",
		line3: "Na 1 slosování",
		price: (MIDDLE_COLUMNS * SPORTKA.pricePerColumn) + SPORTKA.chancePrice,
	}, {
		id: 2,
		columns: RIGHT_COLUMNS,
		hasSuperJackpot: false,
		chance: true,
		title: "Na zkoušku",
		line1: formatColumns(RIGHT_COLUMNS),
		line2: "Včetně Šance",
		line3: "Na 1 slosování",
		price: (RIGHT_COLUMNS * SPORTKA.pricePerColumn) + SPORTKA.chancePrice,
	}];
	const myNumbers: ISportQuickItem = {
		id: 3,
		columns: SPORTKA.maxColumns,
		hasSuperJackpot: true,
		chance: true,
		title: "Oblíbená čísla",
		line1: "Hra o superjackpot",
		line2: formatColumns(SPORTKA.maxColumns),
		line3: "Včetně šance",
		price: (SPORTKA.maxColumns * SPORTKA.pricePerColumn) + SPORTKA.chancePrice,
	};

	return {
		items,
		myNumbers,
	};
}
