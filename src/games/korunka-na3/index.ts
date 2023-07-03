import { IBet, IBetInfo, ILotteryItem } from "~/interfaces";
import { formatColumns, formatPrice, getRandomList, getSameNumbers } from "~/utils/utils";
import { KORUNKA_NA3 } from "~/games/korunka-na3/const";
import { IKorunkaNa3Lottery } from "~/games/korunka-na3/interfaces";
import { sazkaStore } from "~/stores/sazka";

import KorunkaNa3Img from "~/assets/sazka/korunka3.png";

export function getKorunkaNa3Cover(): any {
	return KorunkaNa3Img;
}

export function getKorunkaNa3BetInfo(bet: IBet): Partial<IBetInfo> {
	return {
		gameTitle: "Korunka na 3",
		imgSrc: getKorunkaNa3Cover(),
		title: formatColumns(1),
		desc: bet.korunkaNa3.drawCount === 1
			? "1 slosování"
			: bet.state === "progress"
				? `Slosování ${bet.korunkaNa3.lotteries.length} / ${bet.korunkaNa3.drawCount}`
				: "Předplatné",
	};
}

export function generateKorunkaNa3() {
	return getRandomList(KORUNKA_NA3.min, KORUNKA_NA3.max, KORUNKA_NA3.guessedNumbers, true);
}

export function getKorunkaNa3Lotteries(bet: IBet): Array<ILotteryItem> {
	return bet.korunkaNa3.lotteries.map((lottery, ind) => ({
		ind,
		title: `Slosování ${ind + 1}`,
		price: lottery.winPrice > 0 ? formatPrice(lottery.winPrice) : "-",
		winPrice: lottery.winPrice,
	})) as Array<ILotteryItem>;
}

export function getKorunkaNa3Price(bet: number, drawCount: number) {
	return bet * drawCount;
}

export function getKorunkaNa3Numbers(): Array<number> {
	return getRandomList(KORUNKA_NA3.min, KORUNKA_NA3.max, KORUNKA_NA3.drawNumbers, true);
}

export function getWindDataKorunkaNa3(korunkaNa3: IBet["korunkaNa3"], winNumbers: Array<number>): IKorunkaNa3Lottery {
	const same = getSameNumbers(korunkaNa3.guessedNumbers, winNumbers);
	let winPrice = 0;

	if (same > 0) {
		winPrice = korunkaNa3.bet * KORUNKA_NA3.pricesTable[same];
	}

	return {
		winNumbers,
		winPrice,
	};
}

export function gameKorunkaNa3(guessedNumbers: Array<number>, bet: number, drawCount: number): string {
	const store = sazkaStore.getState();
	const price = getKorunkaNa3Price(bet, drawCount);

	store.addBet(price);
	store.addKorunkaNa3({
		guessedNumbers,
		price,
		bet,
		drawCount,
		lotteries: [],
	});

	return `Hra Korunka za 3 za ${formatPrice(price)}, slosování ${drawCount}, sázka ${formatPrice(bet)}`;
}

export function allInRychlaKorunkaNa3(bet: number, drawCount: number) {
	const storeAmount = sazkaStore.getState().sazka.amount;
	const price = getKorunkaNa3Price(bet, drawCount);
	const times = storeAmount / price >>> 0;

	for (let ind = 0; ind < times; ind++) {
		gameKorunkaNa3(generateKorunkaNa3(), bet, drawCount);
	}

	return `All in Korunka na 3 za ${formatPrice(price * times)}, her ${times}, slosování ${drawCount}, sázka ${formatPrice(bet)}`;
}

export function completeKorunkaNa3(betId: IBet["id"], korunkaNa3: IBet["korunkaNa3"], winNumbers: Array<number>) {
	const store = sazkaStore.getState();
	const winData = getWindDataKorunkaNa3(korunkaNa3, winNumbers);

	store.completeKorunkaNa3(betId, {
		...winData,
	});

	return winData.winPrice;
}
