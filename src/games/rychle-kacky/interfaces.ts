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
