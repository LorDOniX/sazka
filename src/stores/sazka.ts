import { create } from 'zustand';

import { IBet } from "~/interfaces";
import { LS_SETTINGS } from "~/const";
import { getRandomTicketId, getDefaultAmount } from "~/utils/utils";
import { IKorunkaNa3, IKorunkaNa3Lottery } from "~/games/korunka-na3/interfaces";
import { IRychla6, IRychla6Lottery } from "~/games/rychla6/interfaces";
import { IKorunkaNa4, IKorunkaNa4Lottery } from "~/games/korunka-na4/interfaces";
import { IKorunkaNa5, IKorunkaNa5Lottery } from "~/games/korunka-na5/interfaces";
import { IRychleKacky, IRychleKackyLottery } from "~/games/rychle-kacky/interfaces";
import { ISportka, ISportkaLottery } from "~/games/sportka/interfaces";
import { IStastnych10, IStastnych10Lottery } from "~/games/stastnych10/interfaces";
import { IEurojackpot, IEurojackpotLottery } from "~/games/eurojackpot/interfaces";
import { IKasicka, IKasickaLottery } from "~/games/kasicka/interfaces";

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
	// manualni slosovani
	manualDraw: boolean;
}

interface ISettings extends Pick<ISazkaStoreData, "manualDraw"> {}

function getSettings(): ISettings {
	const data = localStorage.getItem(LS_SETTINGS);
	const output: ISettings = {
		manualDraw: false,
	};

	try {
		if (data) {
			const obj: Partial<ISazkaStoreData> = JSON.parse(data);

			output.manualDraw = obj.manualDraw;
		}
	} catch (exc) {
		//
	}

	return output;
}

function saveSettings(settings: ISettings) {
	localStorage.setItem(LS_SETTINGS, JSON.stringify(settings));
}

function getInitState(): ISazkaStoreData {
	const amount = getDefaultAmount();

	return {
		amount,
		allAmount: amount,
		allPrices: 0,
		allBets: 0,
		bets: [],
		...getSettings(),
	};
}

function getInitBet(type: IBet["type"], price: number): IBet {
	return {
		id: getRandomTicketId(),
		state: "new",
		date: new Date().toISOString(),
		completeDate: "",
		type,
		price,
		winPrice: 0,
	};
}

interface ISazkaStore {
	sazka: ISazkaStoreData;
	addAmount: (addAmount: number) => void;
	addBet: (bet: number) => void;
	addRychleKacky: (rychleKacky: IRychleKacky) => void;
	addRychla6: (rychla6: IRychla6) => void;
	addKorunkaNa3: (korunkaNa3: IKorunkaNa3) => void;
	addKorunkaNa4: (korunkaNa4: IKorunkaNa4) => void;
	addKorunkaNa5: (korunkaNa5: IKorunkaNa5) => void;
	addSportka: (sportka: ISportka) => void;
	addKasicka: (kasicka: IKasicka) => void;
	addEurojackpot: (eurojackpot: IEurojackpot) => void;
	addStastnych10: (stastnych10: IStastnych10) => void;
	completeRychleKacky: (betId: number, lottery: IRychleKackyLottery) => void;
	completeRychla6: (betId: number, lottery: IRychla6Lottery) => void;
	completeKorunkaNa3: (betId: number, lottery: IKorunkaNa3Lottery) => void;
	completeKorunkaNa4: (betId: number, lottery: IKorunkaNa4Lottery) => void;
	completeKorunkaNa5: (betId: number, lottery: IKorunkaNa5Lottery) => void;
	completeSportka: (betId: number, lottery: ISportkaLottery) => void;
	completeEurojackpot: (betId: number, lottery: IEurojackpotLottery) => void;
	completeStastnych10: (betId: number, lottery: IStastnych10Lottery) => void;
	completeKasicka: (betId: number, lottery: IKasickaLottery) => void;
	addWinPrice: (winPrice: number) => void;
	clear: () => void;
	clearBets: () => void;
	setManualDraw: (manualDraw: boolean) => void;
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
					...getInitBet("rychle-kacky", rychleKacky.price),
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
					...getInitBet("rychla6", rychla6.price),
					rychla6,
				},
				...state.sazka.bets,
			],
		},
	})),
	addKorunkaNa3: korunkaNa3 => set(state => ({
		sazka: {
			...state.sazka,
			bets: [
				{
					...getInitBet("korunka-na-3", korunkaNa3.price),
					korunkaNa3,
				},
				...state.sazka.bets,
			],
		},
	})),
	addKorunkaNa4: korunkaNa4 => set(state => ({
		sazka: {
			...state.sazka,
			bets: [
				{
					...getInitBet("korunka-na-4", korunkaNa4.price),
					korunkaNa4,
				},
				...state.sazka.bets,
			],
		},
	})),
	addKorunkaNa5: korunkaNa5 => set(state => ({
		sazka: {
			...state.sazka,
			bets: [
				{
					...getInitBet("korunka-na-5", korunkaNa5.price),
					korunkaNa5,
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
					...getInitBet("sportka", sportka.price),
					sportka,
				},
				...state.sazka.bets,
			],
		},
	})),
	addEurojackpot: eurojackpot => set(state => ({
		sazka: {
			...state.sazka,
			bets: [
				{
					...getInitBet("eurojackpot", eurojackpot.price),
					eurojackpot,
				},
				...state.sazka.bets,
			],
		},
	})),
	addKasicka: kasicka => set(state => ({
		sazka: {
			...state.sazka,
			bets: [
				{
					...getInitBet("kasicka", kasicka.price),
					kasicka,
				},
				...state.sazka.bets,
			],
		},
	})),
	addStastnych10: stastnych10 => set(state => ({
		sazka: {
			...state.sazka,
			bets: [
				{
					...getInitBet("stastnych10", stastnych10.price),
					stastnych10,
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
	completeKorunkaNa3: (hash, lottery) => set(state => {
		const bets = state.sazka.bets.slice();
		const bet = bets.filter(item => item.id === hash)[0];
		let winPrice = 0;

		if (bet) {
			bet.korunkaNa3.lotteries = [
				...bet.korunkaNa3.lotteries,
				lottery,
			];
			winPrice = lottery.winPrice;
			bet.winPrice += winPrice;
			bet.completeDate = new Date().toISOString();

			// konec
			if (bet.korunkaNa3.drawCount === bet.korunkaNa3.lotteries.length) {
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
	completeKorunkaNa4: (hash, lottery) => set(state => {
		const bets = state.sazka.bets.slice();
		const bet = bets.filter(item => item.id === hash)[0];
		let winPrice = 0;

		if (bet) {
			bet.korunkaNa4.lotteries = [
				...bet.korunkaNa4.lotteries,
				lottery,
			];
			winPrice = lottery.winPrice;
			bet.winPrice += winPrice;
			bet.completeDate = new Date().toISOString();

			// konec
			if (bet.korunkaNa4.drawCount === bet.korunkaNa4.lotteries.length) {
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
	completeKorunkaNa5: (hash, lottery) => set(state => {
		const bets = state.sazka.bets.slice();
		const bet = bets.filter(item => item.id === hash)[0];
		let winPrice = 0;

		if (bet) {
			bet.korunkaNa5.lotteries = [
				...bet.korunkaNa5.lotteries,
				lottery,
			];
			winPrice = lottery.winPrice;
			bet.winPrice += winPrice;
			bet.completeDate = new Date().toISOString();

			// konec
			if (bet.korunkaNa5.drawCount === bet.korunkaNa5.lotteries.length) {
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
	completeEurojackpot: (hash, lottery) => set(state => {
		const bets = state.sazka.bets.slice();
		const bet = bets.filter(item => item.id === hash)[0];
		let winPrice = 0;

		if (bet) {
			bet.state = "completed";
			bet.completeDate = new Date().toISOString();
			bet.eurojackpot.lottery = lottery;
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
	completeStastnych10: (hash, lottery) => set(state => {
		const bets = state.sazka.bets.slice();
		const bet = bets.filter(item => item.id === hash)[0];
		let winPrice = 0;

		if (bet) {
			bet.state = "completed";
			bet.completeDate = new Date().toISOString();
			bet.stastnych10.lottery = lottery;
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
	completeKasicka: (hash, lottery) => set(state => {
		const bets = state.sazka.bets.slice();
		const bet = bets.filter(item => item.id === hash)[0];
		let winPrice = 0;

		if (bet) {
			bet.kasicka.lottery = lottery;
			bet.state = "completed";
			winPrice = lottery.winPrice;
			bet.winPrice += winPrice;
			bet.completeDate = new Date().toISOString();
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
	setManualDraw: manualDraw => set(state => {
		saveSettings({
			manualDraw,
		});

		return {
			sazka: {
				...state.sazka,
				manualDraw,
			},
		};
	}),
}));
