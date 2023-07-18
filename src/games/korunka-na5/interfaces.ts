export interface IKorunkaNa5Lottery {
	winPrice: number;
	winNumbers: Array<number>;
}

export interface IKorunkaNa5 {
	guessedNumbers: Array<number>;
	price: number;
	bet: number;
	drawCount: number;
	lotteries: Array<IKorunkaNa5Lottery>;
}

export interface IKorunkaNa5QuickItem {
	id: number;
	title: string;
	bet: number;
	drawCount: number;
	price: number;
}
