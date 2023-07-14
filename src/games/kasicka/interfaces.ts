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
