import { NumWithProb } from "~/interfaces";

export type TStistkoVariant = "stistko5" | "stistko10" | "stistko20";

export interface TStistkoVariantConfig {
	variant: TStistkoVariant;
	bet: number;
	muls: Array<NumWithProb>;
	prices: Array<NumWithProb>;
}

export interface IStistkoData {
	prices: Array<number>;
	winNumber: number;
	winPrice: number;
	winMul: number;
}
