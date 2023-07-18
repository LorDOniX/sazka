/* eslint-disable no-magic-numbers */
import { IBet, IBetInfo, ILotteryItem } from "~/interfaces";
import { formatColumns, formatPrice, getRandomList, getSameNumbers, getRandomArbitrary } from "~/utils/utils";
import { RYCHLA6 } from "~/games/rychla6/const";
import { IRychla6Lottery, IRychla6QuickItem } from "./interfaces";
import { sazkaStore } from "~/stores/sazka";

import Rychla6Img from "~/assets/sazka/rychla6.jpg";

export function getRychla6Cover(): any {
	return Rychla6Img;
}

export function getRychla6BetInfo(bet: IBet): Partial<IBetInfo> {
	return {
		gameTitle: "Rychlá 6",
		imgSrc: getRychla6Cover(),
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
	const allNumbers = [];

	for (let ind = 0, max = RYCHLA6.draws.length; ind < max; ind++) {
		const drawNumbers = [];

		/* eslint-disable-next-line */
		while (true) {
			if (drawNumbers.length === RYCHLA6.draws[ind]) {
				break;
			}

			const newNumber = getRandomArbitrary(RYCHLA6.min, RYCHLA6.max) >>> 0;

			if (!allNumbers.includes(newNumber)) {
				allNumbers.push(newNumber);
				drawNumbers.push(newNumber);
			}
		}

		output = [
			...output,
			drawNumbers,
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
			break;
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

export function allInRychla6(times: number, bet: number, drawCount: number) {
	const price = getRychla6Price(bet, drawCount);

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

export function getRychla6QuickItems(): Array<IRychla6QuickItem> {
	return [{
		id: 0,
		title: "Hrát až o 100 000 Kč",
		bet: RYCHLA6.bets[0],
		drawCount: 1,
		price: RYCHLA6.bets[0],
	}, {
		id: 1,
		title: "Zlatý střed",
		bet: RYCHLA6.bets[0],
		drawCount: 5,
		price: RYCHLA6.bets[0] * 5,
	}, {
		id: 3,
		title: "Za 100ku",
		bet: RYCHLA6.bets[0],
		drawCount: 10,
		price: RYCHLA6.bets[0] * 10,
	}, {
		id: 2,
		title: "Hrajte na max",
		bet: RYCHLA6.bets[RYCHLA6.bets.length - 1],
		drawCount: RYCHLA6.maxDrawCount,
		price: RYCHLA6.bets[RYCHLA6.bets.length - 1] * RYCHLA6.maxDrawCount,
	}];
}
