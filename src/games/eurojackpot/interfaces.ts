export interface IEurojackpotColumn {
	index: number;
	guessedNumbers: Array<number>;
	guessedSecondNumbers: Array<number>;
}

export interface IEurojackpotColumnPrice {
	index: number;
	price: number;
}

export interface IEurojackpotLottery {
	// vyhry jednotlivych sloupcu
	columnsPrices: Array<IEurojackpotColumnPrice>;
	// vyhra za sloupce
	columnsPrice: number;
	// vyhra za sanci
	chancePrice: number;
	chance: Array<number>;
	drawNumbers: Array<number>;
	drawSecondNumbers: Array<number>;
}

export interface IEurojackpotData extends Pick<IEurojackpotLottery, "drawNumbers" | "drawSecondNumbers" | "chance"> {}

export interface IEurojackpot {
	// sloupce
	columns: Array<IEurojackpotColumn>;
	// sance
	guessedChance: Array<number>;
	// cena za ticket
	price: number;
	// slosovani
	hasChance: boolean;
	lottery?: IEurojackpotLottery;
}

export interface IEurojackpotGeneratedData {
	columns: Array<IEurojackpotColumn>;
	chance: Array<number>;
}

export interface IEurojackpotQuickItem {
	id: number;
	columns: number;
	chance: boolean;
	title: string;
	line1: string;
	line2: string;
	line3: string;
	price: number;
}
