export interface IKasickaLottery {
	winPrice: number;
	winNumbers: Array<number>;
}

export interface IKasicka {
	guessedNumbers: Array<number>;
	price: number;
	bet: number;
	betRatio: number;
	lottery: IKasickaLottery;
}

export interface IKasickaQuickItem {
	id: number;
	drawNumbers: number;
	title: string;
	line1: string;
	line2: string;
	price: number;
	bet: number;
	betRatio: number;
}
