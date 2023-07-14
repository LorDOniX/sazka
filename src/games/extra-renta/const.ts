/* eslint-disable no-magic-numbers */
export const EXTRA_RENTA = {
	min: 1,
	max: 49,
	perLine: 7,
	drawNumbers: 7,
	guessedNumbers: 7,
	minColumns: 1,
	maxColumns: 4,
	// 100k na 20let
	priceTable: {
		3: 25,
		4: 100,
		5: 1000,
		6: 25000,
		7: 24*10e5,
	},
	pricePerColumn: 25,
};
