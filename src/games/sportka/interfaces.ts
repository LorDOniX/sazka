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

export interface ISportkaGeneratedData {
	columns: Array<ISportkaColumn>;
	chance: Array<number>;
}
