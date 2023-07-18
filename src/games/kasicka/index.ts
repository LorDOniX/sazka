/* eslint-disable no-magic-numbers */
import { IBet, IBetInfo, ILotteryItem } from "~/interfaces";
import { formatPrice, getRandomList, getSameNumbers } from "~/utils/utils";
import { KASICKA } from "~/games/kasicka/const";
import { IKasickaLottery, IKasickaQuickItem } from "./interfaces";
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

export function allInKasicka(times: number, guessedNumbers: number, bet: number, betRatio: number) {
	const price = getKasickaPrice(bet, betRatio);

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

export function getKasickaQuickItems(): Array<IKasickaQuickItem> {
	const ONE_RATIO = 1;
	const FIVE_RATIO = 5;

	return [{
		id: 0,
		drawNumbers: KASICKA.guessedNumbers[KASICKA.guessedNumbers.length - 1],
		title: "Náhodný tip",
		line1: `${KASICKA.guessedNumbers[KASICKA.guessedNumbers.length - 1]} čísel`,
		line2: `Za ${formatPrice(getKasickaPrice(KASICKA.bet, FIVE_RATIO))} na 1 slosování`,
		price: getKasickaPrice(KASICKA.bet, FIVE_RATIO),
		bet: KASICKA.bet,
		betRatio: FIVE_RATIO,
	}, {
		id: 1,
		drawNumbers: KASICKA.guessedNumbers[KASICKA.guessedNumbers.length - 1],
		title: "Náhodný tip",
		line1: `${KASICKA.guessedNumbers[KASICKA.guessedNumbers.length - 1]} čísel`,
		line2: `Za ${formatPrice(getKasickaPrice(KASICKA.bet, ONE_RATIO))} na 1 slosování`,
		price: getKasickaPrice(KASICKA.bet, ONE_RATIO),
		bet: KASICKA.bet,
		betRatio: ONE_RATIO,
	}, {
		id: 2,
		drawNumbers: KASICKA.guessedNumbers[1],
		title: "Náhodný tip",
		line1: `${KASICKA.guessedNumbers[1]} čísla`,
		line2: `Za ${formatPrice(getKasickaPrice(KASICKA.bet, ONE_RATIO))} na 1 slosování`,
		price: getKasickaPrice(KASICKA.bet, ONE_RATIO),
		bet: KASICKA.bet,
		betRatio: ONE_RATIO,
	}];
}
