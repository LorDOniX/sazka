/* eslint-disable no-magic-numbers */
import { IBet, ISportkaData, ISportkaColumn, ISportka } from "~/interfaces";
import { getWinPriceSportka, getWinPriceRychleKacky, getRychleKackyNumbers, getSportkaData, getRychla6Numbers, formatPrice, formatColumns, generateRychleKacky, generateSportkaGame, getRychleKackyPrice, getSportkaPriceData,
	getRychla6Price, getWinDataRychla6, generateRychla6 } from "~/utils/utils";
import { sazkaStore } from "~/stores/sazka";
import { notificationStore } from "~/stores/notification";

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

export function allInRychleKacky(guessedNumbers: number, bet: number, drawCount: number) {
	const storeAmount = sazkaStore.getState().sazka.amount;
	const price = getRychleKackyPrice(bet, drawCount);
	const times = storeAmount / price >>> 0;

	for (let ind = 0; ind < times; ind++) {
		gameRychleKacky(generateRychleKacky(guessedNumbers), bet, drawCount);
	}

	return `All in Rychlé kačky za ${formatPrice(price * times)}, her ${times}, slosování ${drawCount}, sázka ${formatPrice(bet)}`;
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

export function gameSportka(columns: Array<ISportkaColumn>, guessedChance: ISportka["guessedChance"]): string {
	const store = sazkaStore.getState();
	const priceData = getSportkaPriceData(columns.length, guessedChance.length > 0);

	store.addBet(priceData.price);
	store.addSportka({
		...priceData,
		columns,
		guessedChance,
	});

	return `Hra Sportka za ${priceData.price}${priceData.superJackpot ? ", superjackpot" : ""}, ${priceData.hasChance ? "šance" : "bez šance"}, ${formatColumns(columns.length)}`;
}

export function allInSportka(columnsLen: number, hasChance: boolean): string {
	const storeAmount = sazkaStore.getState().sazka.amount;
	const sportka = generateSportkaGame(columnsLen, hasChance);
	const priceData = getSportkaPriceData(sportka.columns.length, sportka.chance.length > 0);
	const times = storeAmount / priceData.price >>> 0;

	for (let ind = 0; ind < times; ind++) {
		gameSportka(sportka.columns, sportka.chance);
	}

	return `All in Sportka za ${formatPrice(priceData.price * times)}${priceData.superJackpot ? ", superjackpot" : ""}, her ${times}, ${formatColumns(sportka.columns.length)}`;
}

function completeRychleKacky(betId: IBet["id"], rychleKacky: IBet["rychleKacky"], winNumbers: Array<number>) {
	const store = sazkaStore.getState();
	const winPrice = getWinPriceRychleKacky(rychleKacky, winNumbers);

	store.completeRychleKacky(betId, {
		winNumbers,
		winPrice,
	});

	return winPrice;
}

export function completeRychla6(betId: IBet["id"], rychla6: IBet["rychla6"], winNumbers: Array<Array<number>>) {
	const store = sazkaStore.getState();
	const winData = getWinDataRychla6(rychla6, winNumbers);

	store.completeRychla6(betId, {
		...winData,
	});

	return winData.winPrice;
}

export function completeSportka(betId: IBet["id"], sportka: IBet["sportka"], data: ISportkaData) {
	const store = sazkaStore.getState();
	const sportkaPrice = getWinPriceSportka(sportka, data);

	store.completeSportka(betId, {
		...sportkaPrice,
		...data,
	});

	return sportkaPrice.columnsPrice + sportkaPrice.chancePrice;
}

export function completeGames() {
	const store = sazkaStore.getState();

	// slosujeme cisla
	const kackaNumbers = getRychleKackyNumbers();
	const sportkaData = getSportkaData();
	const rychla6Numbers = getRychla6Numbers();

	notificationStore.getState().setNotification(`Slosování...`);

	let allPrices = 0;
	let count = 0;

	store.sazka.bets.forEach(bet => {
		if (bet.state !== "completed") {
			switch (bet.type) {
				case "rychle-kacky":
					allPrices += completeRychleKacky(bet.id, bet.rychleKacky, kackaNumbers);
					count++;
					break;

				case "rychla6":
					allPrices += completeRychla6(bet.id, bet.rychla6, rychla6Numbers);
					count++;
					break;

				case "sportka":
					allPrices += completeSportka(bet.id, bet.sportka, sportkaData);
					count++;
					break;

				default:
			}
		}
	});

	// aktualni stav
	count > 0 && notificationStore.getState().setNotification(`Počet sázek ${count}, výhra ${formatPrice(allPrices)}`, allPrices === 0 ? "red" : "green");
	//const toBeDone = store.sazka.bets
	// automaticky slosovat dalsi?
}
