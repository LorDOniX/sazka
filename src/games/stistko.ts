import { STISTKO } from "~/const";
import { IStistkoData, TStistkoVariant, TStistkoVariantConfig } from "~/interfaces";
import { getRandomFromProbList } from "~/utils/utils";

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

export function getStistkoConfigs(): Array<TStistkoVariantConfig> {
	return ["stistko5", "stistko10", "stistko20"].map(variant => getStistkoConfig(variant as TStistkoVariant));
}
