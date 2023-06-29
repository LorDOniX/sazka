import { RYCHLE_KACKY } from "~/const";
import { IBet, IBetInfo, ILotteryItem } from "~/interfaces";
import { formatColumns, formatPrice, getRandomList, getSameNumbers } from "~/utils/utils";
import { sazkaStore } from "~/stores/sazka";

import RychleKackyImg from "~/assets/sazka/rychleKacky.jpg";

export function getRychleKackyBetInfo(bet: IBet): Partial<IBetInfo> {
	return {
		gameTitle: "Rychlé kačky",
		imgSrc: RychleKackyImg,
		title: formatColumns(1),
		desc: bet.rychleKacky.drawCount === 1
			? "1 slosování"
			: bet.state === "progress"
				? `Slosování ${bet.rychleKacky.lotteries.length} / ${bet.rychleKacky.drawCount}`
				: "Předplatné",
	};
}

export function generateRychleKacky(guessedNumbers: number) {
	return getRandomList(RYCHLE_KACKY.min, RYCHLE_KACKY.max, guessedNumbers, true);
}

export function getRychla6Lotteries(bet: IBet): Array<ILotteryItem> {
	return bet.rychleKacky.lotteries.map((lottery, ind) => ({
		ind,
		title: `Slosování ${ind + 1}`,
		price: lottery.winPrice > 0 ? formatPrice(lottery.winPrice) : "-",
		winPrice: lottery.winPrice,
	})) as Array<ILotteryItem>;
}

export function getRychleKackyNumbers(): Array<number> {
	return getRandomList(RYCHLE_KACKY.min, RYCHLE_KACKY.max, RYCHLE_KACKY.drawNumbers, true);
}

export function getWinPriceRychleKacky(rychleKacky: IBet["rychleKacky"], winNumbers: Array<number>) {
	const sameNumbers = getSameNumbers(rychleKacky.guessedNumbers, winNumbers);

	return RYCHLE_KACKY.priceTable[sameNumbers] * rychleKacky.bet;
}

export function getRychleKackyPrice(bet: number, drawCount: number) {
	return bet * drawCount;
}

// 4-6 cisel
export function gameRychleKacky(guessedNumbers: Array<number>, bet: number, drawCount: number): string {
	const store = sazkaStore.getState();
	const price = getRychleKackyPrice(bet, drawCount);

	store.addBet(price);
	store.addRychleKacky({
		guessedNumbers,
		price,
		bet,
		drawCount,
		lotteries: [],
	});

	return `Hra Rychlé kačky za ${formatPrice(price)}, slosování ${drawCount}, sázka ${formatPrice(bet)}`;
}

export function allInRychleKacky(guessedNumbers: number, bet: number, drawCount: number) {
	const storeAmount = sazkaStore.getState().sazka.amount;
	const price = getRychleKackyPrice(bet, drawCount);
	const times = storeAmount / price >>> 0;

	for (let ind = 0; ind < times; ind++) {
		gameRychleKacky(generateRychleKacky(guessedNumbers), bet, drawCount);
	}

	return `All in Rychlé kačky za ${formatPrice(price * times)}, her ${times}, slosování ${drawCount}, sázka ${formatPrice(bet)}`;
}

export function completeRychleKacky(betId: IBet["id"], rychleKacky: IBet["rychleKacky"], winNumbers: Array<number>) {
	const store = sazkaStore.getState();
	const winPrice = getWinPriceRychleKacky(rychleKacky, winNumbers);

	store.completeRychleKacky(betId, {
		winNumbers,
		winPrice,
	});

	return winPrice;
}
