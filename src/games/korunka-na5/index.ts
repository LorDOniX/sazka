/* eslint-disable no-magic-numbers */
import { IBet, IBetInfo, ILotteryItem } from "~/interfaces";
import { formatColumns, formatPrice, getRandomList, getSameNumbers } from "~/utils/utils";
import { KORUNKA_NA5 } from "~/games/korunka-na5/const";
import { IKorunkaNa5Lottery, IKorunkaNa5QuickItem } from "~/games/korunka-na5/interfaces";
import { sazkaStore } from "~/stores/sazka";

import KorunkaNa5Img from "~/assets/sazka/korunka5.png";

export function getKorunkaNa5Cover(): any {
	return KorunkaNa5Img;
}

export function getKorunkaNa5BetInfo(bet: IBet): Partial<IBetInfo> {
	return {
		gameTitle: "Korunka na 5",
		imgSrc: getKorunkaNa5Cover(),
		title: formatColumns(1),
		desc: bet.korunkaNa5.drawCount === 1
			? "1 slosování"
			: bet.state === "progress"
				? `Slosování ${bet.korunkaNa5.lotteries.length} / ${bet.korunkaNa5.drawCount}`
				: "Předplatné",
	};
}

export function generateKorunkaNa5() {
	return getRandomList(KORUNKA_NA5.min, KORUNKA_NA5.max, KORUNKA_NA5.guessedNumbers, true);
}

export function getKorunkaNa5Lotteries(bet: IBet): Array<ILotteryItem> {
	return bet.korunkaNa5.lotteries.map((lottery, ind) => ({
		ind,
		title: `Slosování ${ind + 1}`,
		price: lottery.winPrice > 0 ? formatPrice(lottery.winPrice) : "-",
		winPrice: lottery.winPrice,
	})) as Array<ILotteryItem>;
}

export function getKorunkaNa5Price(bet: number, drawCount: number) {
	return bet * drawCount;
}

export function getKorunkaNa5Numbers(): Array<number> {
	return getRandomList(KORUNKA_NA5.min, KORUNKA_NA5.max, KORUNKA_NA5.drawNumbers, true);
}

export function getWindDataKorunkaNa5(korunkaNa5: IBet["korunkaNa5"], winNumbers: Array<number>): IKorunkaNa5Lottery {
	const same = getSameNumbers(korunkaNa5.guessedNumbers, winNumbers);
	let winPrice = 0;

	if (same > 0) {
		winPrice = korunkaNa5.bet * KORUNKA_NA5.pricesTable[same];
	}

	return {
		winNumbers,
		winPrice,
	};
}

export function gameKorunkaNa5(guessedNumbers: Array<number>, bet: number, drawCount: number): string {
	const store = sazkaStore.getState();
	const price = getKorunkaNa5Price(bet, drawCount);

	store.addBet(price);
	store.addKorunkaNa5({
		guessedNumbers,
		price,
		bet,
		drawCount,
		lotteries: [],
	});

	return `Hra Korunka za 5 za ${formatPrice(price)}, slosování ${drawCount}, sázka ${formatPrice(bet)}`;
}

export function allInRychlaKorunkaNa5(times: number, bet: number, drawCount: number) {
	const price = getKorunkaNa5Price(bet, drawCount);

	for (let ind = 0; ind < times; ind++) {
		gameKorunkaNa5(generateKorunkaNa5(), bet, drawCount);
	}

	return `All in Korunka na 5 za ${formatPrice(price * times)}, her ${times}, slosování ${drawCount}, sázka ${formatPrice(bet)}`;
}

export function completeKorunkaNa5(betId: IBet["id"], korunkaNa5: IBet["korunkaNa5"], winNumbers: Array<number>) {
	const store = sazkaStore.getState();
	const winData = getWindDataKorunkaNa5(korunkaNa5, winNumbers);

	store.completeKorunkaNa5(betId, {
		...winData,
	});

	return winData.winPrice;
}

export function getKorunkaNa5QuickItems(): Array<IKorunkaNa5QuickItem> {
	return [{
		id: 0,
		title: `Hrát za ${formatPrice(KORUNKA_NA5.bets[0])}`,
		bet: KORUNKA_NA5.bets[0],
		drawCount: 1,
		price: KORUNKA_NA5.bets[0],
	}, {
		id: 3,
		title: "Za 100ku",
		bet: KORUNKA_NA5.bets[0],
		drawCount: 3,
		price: KORUNKA_NA5.bets[0] * 3,
	}, {
		id: 1,
		title: "10 slosování",
		bet: KORUNKA_NA5.bets[0],
		drawCount: 10,
		price: KORUNKA_NA5.bets[0] * 10,
	}, {
		id: 2,
		title: "Nejvyšší výhra",
		bet: KORUNKA_NA5.bets[KORUNKA_NA5.bets.length - 1],
		drawCount: 10,
		price: KORUNKA_NA5.bets[KORUNKA_NA5.bets.length - 1] * 10,
	}];
}
