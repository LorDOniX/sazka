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

export interface IRychla6QuickItem {
	id: number;
	title: string;
	bet: number;
	drawCount: number;
	price: number;
}
