export interface IKorunkaNa4Lottery {
	winPrice: number;
	winNumbers: Array<number>;
}

export interface IKorunkaNa4 {
	guessedNumbers: Array<number>;
	price: number;
	bet: number;
	drawCount: number;
	lotteries: Array<IKorunkaNa4Lottery>;
}
