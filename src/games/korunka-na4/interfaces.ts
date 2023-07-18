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

export interface IKorunkaNa4QuickItem {
	id: number;
	title: string;
	bet: number;
	drawCount: number;
	price: number;
}
