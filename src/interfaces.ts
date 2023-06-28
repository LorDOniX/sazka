export interface IKorunkaNa3Lottery {
	winPrice: number;
	winNumbers: Array<number>;
}

export interface IKorunkaNa3 {
	guessedNumbers: Array<number>;
	price: number;
	bet: number;
	drawCount: number;
	lotteries: Array<IKorunkaNa3Lottery>;
}

export interface IRychla6Lottery {
	winPrice: number;
	// 1 - 6
	winIndex: number;
	winNumbers: Array<number>;
}

export interface IRychla6 {
	guessedNumbers: Array<number>;
	price: number;
	bet: number;
	drawCount: number;
	lotteries: Array<IRychla6Lottery>;
}

export interface IRychleKackyLottery {
	winPrice: number;
	winNumbers: Array<number>;
}

export interface IRychleKacky {
	guessedNumbers: Array<number>;
	price: number;
	bet: number;
	drawCount: number;
	lotteries: Array<IRychleKackyLottery>;
}

export interface ISportkaColumn {
	index: number;
	guessedNumbers: Array<number>;
}

export interface ISportkaColumnPrice {
	index: number;
	price1: number;
	price2: number;
}

export interface ISportkaLottery {
	// vyhry jednotlivych sloupcu
	columnsPrices: Array<ISportkaColumnPrice>;
	// vyhra za sloupce
	columnsPrice: number;
	// vyhra za sanci
	chancePrice: number;
	chance: Array<number>;
	drawNumbers1: Array<number>;
	drawNumbers2: Array<number>;
	drawAddOn1: number;
	drawAddOn2: number;
}

export interface ISportkaData extends Pick<ISportkaLottery, "drawNumbers1" | "drawNumbers2" | "drawAddOn1" | "drawAddOn2" | "chance"> {}

export interface ISportka {
	// sloupce
	columns: Array<ISportkaColumn>;
	// sance
	guessedChance: Array<number>;
	// cena za ticket
	price: number;
	// slosovani
	superJackpot: boolean;
	hasChance: boolean;
	lottery?: ISportkaLottery;
}

export interface IBet {
	id: number;
	state: "new" | "progress" | "completed";
	date: string;
	completeDate: string;
	type: "rychle-kacky" | "sportka" | "rychla6" | "korunka-na-3";
	price: number;
	winPrice: number;
	rychleKacky?: null | IRychleKacky;
	sportka?: null | ISportka;
	rychla6?: null | IRychla6;
	korunkaNa3?: null | IKorunkaNa3;
}

export interface ITableItem {
	value: number;
}

export interface ITableLineItem {
	id: string;
	items: Array<ITableItem>;
}

export interface IBetInfo {
	gameTitle: string;
	imgSrc: any;
	title: string;
	desc: string;
	date: string;
	dateTitle: string;
	winPrice: string;
}

export interface ILotteryItem {
	ind: number;
	title: string;
	price: string;
	winPrice: number;
}

export type TTicketGames = "stistko";

export interface ITicketData {
	stistko?: TStistkoVariant;
}

export interface IStistkoData {
	prices: Array<number>;
	winNumber: number;
	winPrice: number;
	winMul: number;
}

export interface NumWithProb {
	value: number;
	prob: number;
}

export type TStistkoVariant = "stistko5" | "stistko10" | "stistko20";

export interface TStistkoVariantConfig {
	variant: TStistkoVariant;
	bet: number;
	muls: Array<NumWithProb>;
	prices: Array<NumWithProb>;
}
