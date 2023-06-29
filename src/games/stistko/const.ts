/* eslint-disable no-magic-numbers */
import { NumWithProb, TStistkoVariantConfig } from "~/interfaces";

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
