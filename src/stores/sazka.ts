import { create } from 'zustand';

import { IBet, IRychleKacky, IRychleKackyLottery, ISportka, ISportkaLottery, IRychla6, IRychla6Lottery } from "~/interfaces";
import { getRandomTicketId, getDefaultAmount } from "~/utils/utils";

interface ISazkaStoreData {
	// soucasny vklad
	amount: number;
	// vsechny vklady
	allAmount: number;
	// vsechny vyhry
	allPrices: number;
	// vsechny sazky
	allBets: number;
	bets: Array<IBet>;
}

function getInitState(): ISazkaStoreData {
	const amount = getDefaultAmount();

	return {
		amount,
		allAmount: amount,
		allPrices: 0,
		allBets: 0,
		bets: [],
	};
}

interface ISazkaStore {
	sazka: ISazkaStoreData;
	addAmount: (addAmount: number) => void;
	addBet: (bet: number) => void;
	addRychleKacky: (rychleKacky: IRychleKacky) => void;
	addRychla6: (rychla6: IRychla6) => void;
	addSportka: (sportka: ISportka) => void;
	completeRychleKacky: (betId: number, lottery: IRychleKackyLottery) => void;
	completeRychla6: (betId: number, lottery: IRychla6Lottery) => void;
	completeSportka: (betId: number, lottery: ISportkaLottery) => void;
	addWinPrice: (winPrice: number) => void;
	clear: () => void;
	clearBets: () => void;
}

export const sazkaStore = create<ISazkaStore>(set => ({
	sazka: getInitState(),
	addAmount: addAmount => set(state => ({
		sazka: {
			...state.sazka,
			amount: state.sazka.amount + addAmount,
			allAmount: state.sazka.allAmount + addAmount,
		},
	})),
	addBet: bet => set(state => ({
		sazka: {
			...state.sazka,
			amount: Math.max(0, state.sazka.amount - bet),
			allBets: state.sazka.allBets + bet,
		},
	})),
	addRychleKacky: rychleKacky => set(state => ({
		sazka: {
			...state.sazka,
			bets: [
				{
					id: getRandomTicketId(),
					state: "new",
					date: new Date().toISOString(),
					completeDate: "",
					type: "rychle-kacky",
					price: rychleKacky.price,
					winPrice: 0,
					rychleKacky,
				},
				...state.sazka.bets,
			],
		},
	})),
	addRychla6: rychla6 => set(state => ({
		sazka: {
			...state.sazka,
			bets: [
				{
					id: getRandomTicketId(),
					state: "new",
					date: new Date().toISOString(),
					completeDate: "",
					type: "rychla6",
					price: rychla6.price,
					winPrice: 0,
					rychla6,
				},
				...state.sazka.bets,
			],
		},
	})),
	addSportka: sportka => set(state => ({
		sazka: {
			...state.sazka,
			bets: [
				{
					id: getRandomTicketId(),
					state: "new",
					date: new Date().toISOString(),
					completeDate: "",
					type: "sportka",
					price: sportka.price,
					winPrice: 0,
					sportka,
				},
				...state.sazka.bets,
			],
		},
	})),
	completeRychleKacky: (hash, lottery) => set(state => {
		const bets = state.sazka.bets.slice();
		const bet = bets.filter(item => item.id === hash)[0];
		let winPrice = 0;

		if (bet) {
			bet.rychleKacky.lotteries = [
				...bet.rychleKacky.lotteries,
				lottery,
			];
			winPrice = lottery.winPrice;
			bet.winPrice += winPrice;
			bet.completeDate = new Date().toISOString();

			// konec
			if (bet.rychleKacky.drawCount === bet.rychleKacky.lotteries.length) {
				bet.state = "completed";
			} else {
				bet.state = "progress";
			}
		}

		return {
			sazka: {
				...state.sazka,
				bets,
				amount: state.sazka.amount + winPrice,
				allPrices: state.sazka.allPrices + winPrice,
			},
		};
	}),
	completeRychla6: (hash, lottery) => set(state => {
		const bets = state.sazka.bets.slice();
		const bet = bets.filter(item => item.id === hash)[0];
		let winPrice = 0;

		if (bet) {
			bet.rychla6.lotteries = [
				...bet.rychla6.lotteries,
				lottery,
			];
			winPrice = lottery.winPrice;
			bet.winPrice += winPrice;
			bet.completeDate = new Date().toISOString();

			// konec
			if (bet.rychla6.drawCount === bet.rychla6.lotteries.length) {
				bet.state = "completed";
			} else {
				bet.state = "progress";
			}
		}

		return {
			sazka: {
				...state.sazka,
				bets,
				amount: state.sazka.amount + winPrice,
				allPrices: state.sazka.allPrices + winPrice,
			},
		};
	}),
	completeSportka: (hash, lottery) => set(state => {
		const bets = state.sazka.bets.slice();
		const bet = bets.filter(item => item.id === hash)[0];
		let winPrice = 0;

		if (bet) {
			bet.state = "completed";
			bet.completeDate = new Date().toISOString();
			bet.sportka.lottery = lottery;
			winPrice = lottery.columnsPrice + lottery.chancePrice;
			bet.winPrice = winPrice;
		}

		return {
			sazka: {
				...state.sazka,
				bets,
				amount: state.sazka.amount + winPrice,
				allPrices: state.sazka.allPrices + winPrice,
			},
		};
	}),
	addWinPrice: winPrice => set(state => ({
		sazka: {
			...state.sazka,
			amount: state.sazka.amount + winPrice,
			allPrices: state.sazka.allPrices + winPrice,
		},
	})),
	clear: () => set(() => ({
		sazka: getInitState(),
	})),
	clearBets: () => set(state => ({
		sazka: {
			...state.sazka,
			bets: [],
		},
	})),
}));
