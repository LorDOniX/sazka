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

export interface IRychleKackyQuickItem {
	id: number;
	guessedNumbers: number;
	bet: number;
	drawCount: number;
	price: number;
}
