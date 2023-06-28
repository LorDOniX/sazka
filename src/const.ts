/* eslint-disable no-magic-numbers */
import { NumWithProb, TStistkoVariantConfig } from "./interfaces";

export const KEYS = {
	ESC: "Escape",
	LEFT: "ArrowLeft",
	RIGHT: "ArrowRight",
	UP: "ArrowUp",
	DOWN: "ArrowDown",
	ENTER: "Enter",
};

export const ROUTES = {
	ROOT: "/",
};

export const DEFAULT_AMOUNT = 1000;

export const DEFAULT_INSERT_AMOUNT = 100;

export const BUTTONS_AMOUNTS = [250, 500, 1000, 2500, 5000];

export const RYCHLE_KACKY = {
	min: 1,
	max: 66,
	perLine: 11,
	drawNumbers: 12,
	guessedNumbersMax: 6,
	// pro 6 cisel
	priceTable: {
		0: 0,
		1: 0,
		2: 1,
		3: 2,
		4: 5,
		5: 50,
		6: 5000,
	},
	minDrawCount: 1,
	drawCountUpdatedValue: 1,
	betUpdatedValue: 10,
	defaultBet: 10,
};

// losuje se 2x (6 čísel + 1 dodatkové); šance se losuje 6 čísel
export const SPORTKA = {
	min: 1,
	max: 49,
	chanceMin: 1,
	chanceMax: 9,
	perLine: 7,
	drawNumbers: 6,
	addDrawNumber: 1,
	specialPriceColumns: 5,
	guessedNumbers: 6,
	guessedNumbersChance: 6,
	minColumns: 1,
	maxColumns: 10,
	// uhodnotych + dodatkove - https://www.hazardni-hry.eu/loterie/sportka.html
	priceTable: {
		0: 0,
		1: 0,
		2: 0,
		3: 113,
		4: 619,
		5: 24971,
		// jackpot
		6: 15382198,
	},
	priceTableSpecial: {
		// 5 + dodatkove
		fivePlusAddOn: 815723,
		// 6 + posledni cislo sance - superjackpot
		sixWithChance: 121387292,
	},
	// tabulka sanci - posledni cislo
	chanceTable: {
		0: 0,
		1: 50,
		2: 100,
		3: 1000,
		4: 10000,
		5: 100000,
		// random
		6: 1500000,
	},
	favouriteNumbers: {
		columns: [
			[4, 8, 15, 16, 23, 42],
			[10, 11, 12, 20, 21, 25],
			[3, 12, 13, 19, 22, 28],
			[3, 6, 8, 27, 32, 46],
			[7, 8, 12, 19, 26, 31],
			[5, 8, 13, 21, 27, 37],
		],
	},
	pricePerColumn: 20,
	chancePrice: 20,
};

// stistko 5, 10, 20
// 9 cisel, 9 ctyrlistku
// nasobeni 1x-10x
// 3x stejne - to cislo * nasobeni
// jedno cislo nemuze byt vicekrat jak 3x?
// 10k, 100k, 50, 40, 100, 500, 200, 10,

// vyhra az 200k u 20k
// vyhra az 50k u 5kc
// 500, 10, 25, 100, 50k 5k,
// nasobeni az 5x

/**
 * stistko 5 Kč - nasobeni max 5x max 50k priceRatio 1x
 * stistko 10 Kč - nasobeni max 10x max 100k priceRatio 2x
 * stistko 20 Kč - nasobeni max 20x max 200k priceRatio 4x
 * generuju 9 cisel, max 3 stejne
 * tabulka:
 * 5 10 20
 * 10 20 50
 * 25 50 100
 * 50 100 250
 * 100 200 500
 * 250 500 1000
 * 500 750 1500
 * 1000, 2000 5000
 * 2000, 4000 10000
 * 5000 10000 25000
 * 10000 20000 500000
 * 25000 50000 100000
 * 50000 100000 200000
 */
// budu mit 3 cisla 5, 10, 25
// udelam z toho exponenty 10(3+1) = 10000,
// - 5: 0-9 10(0) - 10(1)-1
// - 10: 10-99
// - 25 100-
const STISTKO_PRICES = [
	{ value: 5, prob: 10 },
	{ value: 10, prob: 10 },
	{ value: 25, prob: 10 },
	{ value: 50, prob: 10 },
	{ value: 100, prob: 10 },
	{ value: 250, prob: 7 },
	{ value: 500, prob: 7 },
	{ value: 1000, prob: 7 },
	{ value: 2000, prob: 7 },
	{ value: 5000, prob: 7 },
	{ value: 10000, prob: 5 },
	{ value: 25000, prob: 5 },
	{ value: 50000, prob: 5 },
] as Array<NumWithProb>;

const STISTKO_MULS = {
	variant5: 1,
	variant10: 2,
	variant20: 4,
};

export const STISTKO = {
	variant5: {
		variant: "stistko5",
		bet: 5,
		muls: [
			{ value: 1, prob: 50 },
			{ value: 2, prob: 40 },
			{ value: 5, prob: 10 },
		],
		prices: STISTKO_PRICES,
	} as TStistkoVariantConfig,
	variant10: {
		variant: "stistko10",
		bet: 10,
		muls: [
			{ value: 1, prob: 40 },
			{ value: 2, prob: 30 },
			{ value: 5, prob: 20 },
			{ value: 10, prob: 10 },
		],
		prices: STISTKO_PRICES.map(item => ({
			...item,
			value: item.value * STISTKO_MULS.variant10,
		})),
	} as TStistkoVariantConfig,
	variant20: {
		variant: "stistko20",
		bet: 20,
		muls: [
			{ value: 1, prob: 30 },
			{ value: 2, prob: 25 },
			{ value: 5, prob: 20 },
			{ value: 10, prob: 15 },
			{ value: 20, prob: 10 },
		],
		prices: STISTKO_PRICES.map(item => ({
			...item,
			value: item.value * STISTKO_MULS.variant20,
		})),
	} as TStistkoVariantConfig,
	// losujeme 9
	numbers: 9,
	// 3 stejne pro vyhru, nemuzou byt vic jak 3 stejne v jednom ticketu
	same: 3,
};

export const RYCHLA6 = {
	guessedNumbers: 6,
	min: 1,
	max: 26,
	minDrawCount: 1,
	drawCountUpdatedValue: 1,
	perLine: 6,
	draws: [6, 3, 3, 3, 3, 3],
	bets: [10, 20, 30, 40, 50, 100, 200, 500],
	priceRangeMin: [10, 100],
	priceRangeMax: [200, 500],
	priceTable: [{
		mulMin: 10000,
		mulMax: 12500,
	}, {
		mulMin: 250,
		mulMax: 250,
	}, {
		mulMin: 50,
		mulMax: 50,
	}, {
		mulMin: 5,
		mulMax: 5,
	}, {
		mulMin: 2,
		mulMax: 2,
	}, {
		mulMin: 1,
		mulMax: 1,
	}],
};

export const KORUNKA_NA5 = {
	minDrawCount: 1,
	drawCountUpdatedValue: 1,
	perLine: 7,
	guessedNumbers: 5,
	drawNumbers: 6,
	min: 1,
	max: 49,
	bets: [35, 70, 105, 140, 175],
	pricesTable: {
		5: 2000000 / 35,
		4: 15000 / 35,
		3: 500 / 35,
		2: 50 / 35,
	},
};

export const KORUNKA_NA4 = {
	minDrawCount: 1,
	drawCountUpdatedValue: 1,
	perLine: 7,
	guessedNumbers: 4,
	drawNumbers: 6,
	min: 1,
	max: 49,
	bets: [25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275],
	pricesTable: {
		4: 600,
		3: 20,
		2: 2,
		1: 1,
	},
};

export const KORUNKA_NA3 = {
	minDrawCount: 1,
	drawCountUpdatedValue: 1,
	perLine: 7,
	guessedNumbers: 3,
	drawNumbers: 6,
	min: 1,
	max: 49,
	bets: [15, 30, 45, 60, 75, 90, 105, 135, 165, 195, 225],
	pricesTable: {
		3: 500 / 3,
		2: 10 / 3,
		1: 1,
	},
};
