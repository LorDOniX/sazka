import { IBet, IBetInfo, ILotteryItem } from "~/interfaces";
import { formatPrice, getRandomList, getSameNumbers } from "~/utils/utils";
import { KASICKA } from "~/games/kasicka/const";
import { IKasickaLottery } from "./interfaces";
import { sazkaStore } from "~/stores/sazka";

import KasickaImg from "~/assets/sazka/kasicka.jpg";

export function getKasickaCover(): any {
	return KasickaImg;
}

export function getKasickaBetInfo(bet: IBet): Partial<IBetInfo> {
	return {
		gameTitle: "Kasička",
		imgSrc: getKasickaCover(),
		title: `Počet čísel ${bet.kasicka.guessedNumbers.length}`,
		desc: "1 slosování",
	};
}

export function generateKasicka(guessedNumbers: number) {
	return getRandomList(KASICKA.min, KASICKA.max, guessedNumbers, true);
}

export function getKasickaLotteries(bet: IBet): Array<ILotteryItem> {
	const lottery = bet.kasicka.lottery;

	return [{
		ind: 0,
		title: `Slosování 1`,
		price: lottery.winPrice > 0 ? formatPrice(lottery.winPrice) : "-",
		winPrice: lottery.winPrice,
	}];
}

export function getKasickaPrice(bet: number, betRatio: number) {
	return bet * betRatio;
}

export function getKasickaNumbers(): Array<number> {
	return getRandomList(KASICKA.min, KASICKA.max, KASICKA.drawNumbers, true);
}

export function getWinDataKasicka(kasicka: IBet["kasicka"], winNumbers: Array<number>): IKasickaLottery {
	const same = getSameNumbers(kasicka.guessedNumbers, winNumbers);
	const pricesSource = KASICKA.priceTable[kasicka.guessedNumbers.length];
	const winPrice = same in pricesSource
		? pricesSource[same] * kasicka.betRatio
		: 0;

	return {
		winPrice,
		winNumbers,
	};
}

export function gameKasicka(guessedNumbers: Array<number>, bet: number, betRatio: number): string {
	const store = sazkaStore.getState();
	const price = getKasickaPrice(bet, betRatio);

	store.addBet(price);
	store.addKasicka({
		guessedNumbers,
		price,
		bet,
		betRatio,
		lottery: null,
	});

	return `Hra Kasička za ${formatPrice(price)}, násobič ${betRatio}x, sázka ${formatPrice(bet)}`;
}

export function allInKasicka(guessedNumbers: number, bet: number, betRatio: number) {
	const storeAmount = sazkaStore.getState().sazka.amount;
	const price = getKasickaPrice(bet, betRatio);
	const times = storeAmount / price >>> 0;

	for (let ind = 0; ind < times; ind++) {
		gameKasicka(generateKasicka(guessedNumbers), bet, betRatio);
	}

	return `All in Kasička za ${formatPrice(price * times)}, her ${times}, násobič ${betRatio}x, sázka ${formatPrice(bet)}`;
}

export function completeKasicka(betId: IBet["id"], kasicka: IBet["kasicka"], winNumbers: Array<number>) {
	const store = sazkaStore.getState();
	const winData = getWinDataKasicka(kasicka, winNumbers);

	store.completeKasicka(betId, {
		...winData,
	});

	return winData.winPrice;
}
