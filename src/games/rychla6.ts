import { IBet, IBetInfo, ILotteryItem, IRychla6Lottery } from "~/interfaces";
import { formatColumns, formatPrice, getRandomList, getSameNumbers } from "~/utils/utils";
import { RYCHLA6 } from "~/const";
import { sazkaStore } from "~/stores/sazka";

import Rychla6Img from "~/assets/sazka/rychla6.jpg";

export function getRychla6BetInfo(bet: IBet): Partial<IBetInfo> {
	return {
		gameTitle: "Rychlá 6",
		imgSrc: Rychla6Img,
		title: formatColumns(1),
		desc: bet.rychla6.drawCount === 1
			? "1 slosování"
			: bet.state === "progress"
				? `Slosování ${bet.rychla6.lotteries.length} / ${bet.rychla6.drawCount}`
				: "Předplatné",
	};
}

export function generateRychla6() {
	return getRandomList(RYCHLA6.min, RYCHLA6.max, RYCHLA6.guessedNumbers, true);
}

export function getRychla6Lotteries(bet: IBet): Array<ILotteryItem> {
	return bet.rychla6.lotteries.map((lottery, ind) => ({
		ind,
		title: `Slosování ${ind + 1}`,
		price: lottery.winPrice > 0 ? formatPrice(lottery.winPrice) : "-",
		winPrice: lottery.winPrice,
	})) as Array<ILotteryItem>;
}

export function getRychla6Price(bet: number, drawCount: number) {
	return bet * drawCount;
}

export function getRychla6Numbers(): Array<Array<number>> {
	let output = [];

	for (let ind = 0, max = RYCHLA6.draws.length; ind < max; ind++) {
		output = [
			...output,
			getRandomList(RYCHLA6.min, RYCHLA6.max, RYCHLA6.draws[ind], true),
		];
	}

	return output;
}

export function getWinDataRychla6(rychla6: IBet["rychla6"], winNumbers: Array<Array<number>>): IRychla6Lottery {
	let lotteryNumbers = [];
	const isMaxMul = rychla6.bet >= RYCHLA6.priceRangeMax[0];
	let winPrice = 0;
	let winIndex = 0;

	for (let ind = 0, max = winNumbers.length; ind < max; ind++) {
		lotteryNumbers = [
			...lotteryNumbers,
			...winNumbers[ind],
		];

		const same = getSameNumbers(rychla6.guessedNumbers, lotteryNumbers);

		if (same === RYCHLA6.guessedNumbers) {
			// vyhra
			const mul = isMaxMul ? RYCHLA6.priceTable[ind].mulMax : RYCHLA6.priceTable[ind].mulMin;

			winPrice = rychla6.bet * mul;
			winIndex = ind + 1;
		}
	}

	return {
		winIndex,
		winPrice,
		winNumbers: lotteryNumbers,
	};
}

export function gameRychla6(guessedNumbers: Array<number>, bet: number, drawCount: number): string {
	const store = sazkaStore.getState();
	const price = getRychla6Price(bet, drawCount);

	store.addBet(price);
	store.addRychla6({
		guessedNumbers,
		price,
		bet,
		drawCount,
		lotteries: [],
	});

	return `Hra Rychlá 6 za ${formatPrice(price)}, slosování ${drawCount}, sázka ${formatPrice(bet)}`;
}

export function allInRychla6(bet: number, drawCount: number) {
	const storeAmount = sazkaStore.getState().sazka.amount;
	const price = getRychla6Price(bet, drawCount);
	const times = storeAmount / price >>> 0;

	for (let ind = 0; ind < times; ind++) {
		gameRychla6(generateRychla6(), bet, drawCount);
	}

	return `All in Rychlá 6 za ${formatPrice(price * times)}, her ${times}, slosování ${drawCount}, sázka ${formatPrice(bet)}`;
}

export function completeRychla6(betId: IBet["id"], rychla6: IBet["rychla6"], winNumbers: Array<Array<number>>) {
	const store = sazkaStore.getState();
	const winData = getWinDataRychla6(rychla6, winNumbers);

	store.completeRychla6(betId, {
		...winData,
	});

	return winData.winPrice;
}
