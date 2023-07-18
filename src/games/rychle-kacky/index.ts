import { IBet, IBetInfo, ILotteryItem } from "~/interfaces";
import { formatColumns, formatPrice, getRandomList, getSameNumbers } from "~/utils/utils";
import { RYCHLE_KACKY } from "./const";
import { sazkaStore } from "~/stores/sazka";

import RychleKackyImg from "~/assets/sazka/rychleKacky.jpg";
import { IRychleKackyQuickItem } from "./interfaces";

export function getRychleKackyCover(): any {
	return RychleKackyImg;
}

export function getRychleKackyBetInfo(bet: IBet): Partial<IBetInfo> {
	return {
		gameTitle: "Rychlé kačky",
		imgSrc: getRychleKackyCover(),
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

export function getRychleKackyLotteries(bet: IBet): Array<ILotteryItem> {
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

export function allInRychleKacky(times: number, guessedNumbers: number, bet: number, drawCount: number) {
	const price = getRychleKackyPrice(bet, drawCount);

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

export function getRychleKackyQuickItems() {
	const FIRST_ITEM = {
		bet: RYCHLE_KACKY.bets[1],
		drawCount: 2,
	};

	const SECOND_ITEM = {
		bet: RYCHLE_KACKY.bets[1],
		drawCount: 5,
	};

	const THIRD_ITEM = {
		bet: RYCHLE_KACKY.bets[2],
		drawCount: 5,
	};

	const FORTH_ITEM = {
		bet: RYCHLE_KACKY.bets[1],
		drawCount: 10,
	};

	const items: Array<IRychleKackyQuickItem> = [{
		id: 0,
		guessedNumbers: RYCHLE_KACKY.guessedNumbersMax,
		bet: FIRST_ITEM.bet,
		drawCount: FIRST_ITEM.drawCount,
		price: FIRST_ITEM.bet * FIRST_ITEM.drawCount,
	}, {
		id: 1,
		guessedNumbers: RYCHLE_KACKY.guessedNumbersMax,
		bet: SECOND_ITEM.bet,
		drawCount: SECOND_ITEM.drawCount,
		price: SECOND_ITEM.bet * SECOND_ITEM.drawCount,
	}, {
		id: 2,
		guessedNumbers: RYCHLE_KACKY.guessedNumbersMax,
		bet: THIRD_ITEM.bet,
		drawCount: THIRD_ITEM.drawCount,
		price: THIRD_ITEM.bet * THIRD_ITEM.drawCount,
	}, {
		id: 3,
		guessedNumbers: RYCHLE_KACKY.guessedNumbersMax,
		bet: FORTH_ITEM.bet,
		drawCount: FORTH_ITEM.drawCount,
		price: FORTH_ITEM.bet * FORTH_ITEM.drawCount,
	}];

	return items;
}
