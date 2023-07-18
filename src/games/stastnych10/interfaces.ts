export interface IStastnych10Column {
	index: number;
	// kralovska hra
	kingGame: boolean;
	// sazka
	bet: number;
	// vyhra
	price: number;
	guessedNumbers: Array<number>;
}

export interface IStastnych10ColumnPrice {
	index: number;
	price: number;
}

export interface IStastnych10Data extends Pick<IStastnych10Lottery, "drawNumbers" | "chance" | "kingNumber"> {}

export interface IStastnych10Lottery {
	// vyhry jednotlivych sloupcu
	columnsPrices: Array<IStastnych10ColumnPrice>;
	// vyhra za sloupce
	columnsPrice: number;
	// vyhra za sanci
	chancePrice: number;
	chance: Array<number>;
	drawNumbers: Array<number>;
	kingNumber: number;
}

export interface IStastnych10 {
	// sloupce
	columns: Array<IStastnych10Column>;
	// sance
	guessedChance: Array<number>;
	// cena za ticket
	price: number;
	// slosovani
	hasChance: boolean;
	lottery?: IStastnych10Lottery;
}

export interface IStastnych10GeneratedData {
	columns: Array<IStastnych10Column>;
	chance: Array<number>;
}

export interface IStastnych10QuickItem {
	id: number;
	columns: number;
	count: number;
	bet: number;
	kingGame: boolean;
	chance: boolean;
	title: string;
	line1: string;
	line2: string;
	price: number;
}
