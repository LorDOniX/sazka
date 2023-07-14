/* eslint-disable no-magic-numbers */
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
		3: 10e2,
		4: 10e3,
		5: 10e4,
		// random
		6: 1.5 * 10e5,
	},
	favouriteNumbers: {
		columns: [
			[4, 8, 15, 16, 23, 42],
			[10, 11, 12, 20, 21, 25],
			[3, 12, 13, 19, 22, 28],
			[3, 6, 8, 27, 32, 46],
			[7, 8, 12, 19, 26, 31],
			[5, 8, 13, 21, 27, 37],
			[7, 23, 24, 32, 38, 43],
		],
	},
	pricePerColumn: 20,
	chancePrice: 20,
};
