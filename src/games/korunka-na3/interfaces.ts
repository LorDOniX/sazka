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

export interface IKorunkaNa3QuickItem {
	id: number;
	title: string;
	bet: number;
	drawCount: number;
	price: number;
}
