/* eslint-disable no-magic-numbers */
export const KASICKA = {
	min: 1,
	max: 49,
	perLine: 7,
	drawNumbers: 6,
	guessedNumbers: [3, 4, 5],
	// 1 sloupec na 1 slosovani
	// 100k na 20let
	priceTable: {
		// pocet cisel
		5: {
			5: 10e5,
			4: 5000,
			3: 300,
			2: 40,
		},
		4: {
			4: 10000,
			3: 300,
			2: 40,
			1: 20,
		},
		3: {
			3: 2000,
			2: 100,
			1: 20,
		},
	},
	bet: 20,
	betRatio: [1, 2, 3, 5, 10, 15, 20, 50],
};
