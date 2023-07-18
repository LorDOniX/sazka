/* eslint-disable no-magic-numbers */
import { IBet, IBetInfo, ILotteryItem } from "~/interfaces";
import { formatColumns, formatPrice, getRandomList, getSameNumbers } from "~/utils/utils";
import { KORUNKA_NA4 } from "~/games/korunka-na4/const";
import { IKorunkaNa4Lottery, IKorunkaNa4QuickItem } from "~/games/korunka-na4/interfaces";
import { sazkaStore } from "~/stores/sazka";

import KorunkaNa4Img from "~/assets/sazka/korunka4.png";

export function getKorunkaNa4Cover(): any {
	return KorunkaNa4Img;
}

export function getKorunkaNa4BetInfo(bet: IBet): Partial<IBetInfo> {
	return {
		gameTitle: "Korunka na 4",
		imgSrc: getKorunkaNa4Cover(),
		title: formatColumns(1),
		desc: bet.korunkaNa4.drawCount === 1
			? "1 slosování"
			: bet.state === "progress"
				? `Slosování ${bet.korunkaNa4.lotteries.length} / ${bet.korunkaNa4.drawCount}`
				: "Předplatné",
	};
}

export function generateKorunkaNa4() {
	return getRandomList(KORUNKA_NA4.min, KORUNKA_NA4.max, KORUNKA_NA4.guessedNumbers, true);
}

export function getKorunkaNa4Lotteries(bet: IBet): Array<ILotteryItem> {
	return bet.korunkaNa4.lotteries.map((lottery, ind) => ({
		ind,
		title: `Slosování ${ind + 1}`,
		price: lottery.winPrice > 0 ? formatPrice(lottery.winPrice) : "-",
		winPrice: lottery.winPrice,
	})) as Array<ILotteryItem>;
}

export function getKorunkaNa4Price(bet: number, drawCount: number) {
	return bet * drawCount;
}

export function getKorunkaNa4Numbers(): Array<number> {
	return getRandomList(KORUNKA_NA4.min, KORUNKA_NA4.max, KORUNKA_NA4.drawNumbers, true);
}

export function getWindDataKorunkaNa4(korunkaNa4: IBet["korunkaNa4"], winNumbers: Array<number>): IKorunkaNa4Lottery {
	const same = getSameNumbers(korunkaNa4.guessedNumbers, winNumbers);
	let winPrice = 0;

	if (same > 0) {
		winPrice = korunkaNa4.bet * KORUNKA_NA4.pricesTable[same];
	}

	return {
		winNumbers,
		winPrice,
	};
}

export function gameKorunkaNa4(guessedNumbers: Array<number>, bet: number, drawCount: number): string {
	const store = sazkaStore.getState();
	const price = getKorunkaNa4Price(bet, drawCount);

	store.addBet(price);
	store.addKorunkaNa4({
		guessedNumbers,
		price,
		bet,
		drawCount,
		lotteries: [],
	});

	return `Hra Korunka za 4 za ${formatPrice(price)}, slosování ${drawCount}, sázka ${formatPrice(bet)}`;
}

export function allInRychlaKorunkaNa4(times: number, bet: number, drawCount: number) {
	const price = getKorunkaNa4Price(bet, drawCount);

	for (let ind = 0; ind < times; ind++) {
		gameKorunkaNa4(generateKorunkaNa4(), bet, drawCount);
	}

	return `All in Korunka na 4 za ${formatPrice(price * times)}, her ${times}, slosování ${drawCount}, sázka ${formatPrice(bet)}`;
}

export function completeKorunkaNa4(betId: IBet["id"], korunkaNa4: IBet["korunkaNa4"], winNumbers: Array<number>) {
	const store = sazkaStore.getState();
	const winData = getWindDataKorunkaNa4(korunkaNa4, winNumbers);

	store.completeKorunkaNa4(betId, {
		...winData,
	});

	return winData.winPrice;
}

export function getKorunkaNa4QuickItems(): Array<IKorunkaNa4QuickItem> {
	return [{
		id: 0,
		title: `Hrát za ${formatPrice(KORUNKA_NA4.bets[0])}`,
		bet: KORUNKA_NA4.bets[0],
		drawCount: 1,
		price: KORUNKA_NA4.bets[0],
	}, {
		id: 3,
		title: "Za 100ku",
		bet: KORUNKA_NA4.bets[0],
		drawCount: 4,
		price: KORUNKA_NA4.bets[0] * 4,
	}, {
		id: 1,
		title: "10 slosování",
		bet: KORUNKA_NA4.bets[0],
		drawCount: 10,
		price: KORUNKA_NA4.bets[0] * 10,
	}, {
		id: 2,
		title: "Nejvyšší výhra",
		bet: KORUNKA_NA4.bets[KORUNKA_NA4.bets.length - 1],
		drawCount: 10,
		price: KORUNKA_NA4.bets[KORUNKA_NA4.bets.length - 1] * 10,
	}];
}
