import { formatDate, formatPrice } from "~/utils/utils";
import { IBet, IBetInfo, ILotteryItem } from "~/interfaces";
import { sazkaStore } from "~/stores/sazka";
import { notificationStore } from "~/stores/notification";
import { completeRychleKacky, getRychleKackyBetInfo, getRychleKackyLotteries, getRychleKackyNumbers } from "~/games/rychle-kacky";
import { completeRychla6, getRychla6BetInfo, getRychla6Lotteries, getRychla6Numbers } from "~/games/rychla6";
import { completeKorunkaNa3, getKorunkaNa3BetInfo, getKorunkaNa3Lotteries, getKorunkaNa3Numbers } from "~/games/korunka-na3";
import { completeKorunkaNa4, getKorunkaNa4BetInfo, getKorunkaNa4Lotteries, getKorunkaNa4Numbers } from "~/games/korunka-na4";
import { completeKorunkaNa5, getKorunkaNa5BetInfo, getKorunkaNa5Lotteries, getKorunkaNa5Numbers } from "~/games/korunka-na5";
import { completeSportka, getSportkaBetInfo, getSportkaData, getSportkaLotteries } from "~/games/sportka";
import { completeStastnych10, getStastnych10BetInfo, getStastnych10Data, getStastnych10Lotteries } from "./stastnych10";
import { completeEurojackpot, getEurojackpotBetInfo, getEurojackpotData, getEurojackpotLotteries } from "./eurojackpot";
import { completeKasicka, getKasickaBetInfo, getKasickaLotteries, getKasickaNumbers } from "./kasicka";

export function getBetInfo(bet: IBet) {
	let output: IBetInfo = {
		gameTitle: "",
		imgSrc: null,
		title: "",
		desc: "",
		date: formatDate(bet.state === "completed" ? bet.completeDate : bet.date),
		dateTitle: bet.state === "completed" ? "Slosováno" : "Slosování",
		winPrice: bet.state === "new"
			? ""
			: bet.winPrice > 0 ? `Výhra ${formatPrice(bet.winPrice)}` : "-",
	};

	switch (bet.type) {
		case "rychle-kacky":
			output = {
				...output,
				...getRychleKackyBetInfo(bet),
			};
			break;

		case "rychla6":
			output = {
				...output,
				...getRychla6BetInfo(bet),
			};
			break;

		case "korunka-na-3":
			output = {
				...output,
				...getKorunkaNa3BetInfo(bet),
			};
			break;

		case "korunka-na-4":
			output = {
				...output,
				...getKorunkaNa4BetInfo(bet),
			};
			break;

		case "korunka-na-5":
			output = {
				...output,
				...getKorunkaNa5BetInfo(bet),
			};
			break;

		case "sportka":
			output = {
				...output,
				...getSportkaBetInfo(bet),
			};
			break;

		case "stastnych10":
			output = {
				...output,
				...getStastnych10BetInfo(bet),
			};
			break;

		case "eurojackpot":
			output = {
				...output,
				...getEurojackpotBetInfo(bet),
			};
			break;

		case "kasicka":
			output = {
				...output,
				...getKasickaBetInfo(bet),
			};
			break;

		default:
	}

	return output;
}

export function getLotteries(bet: IBet): Array<ILotteryItem> {
	switch (bet.type) {
		case "rychle-kacky":
			return getRychleKackyLotteries(bet);

		case "rychla6":
			return getRychla6Lotteries(bet);

		case "korunka-na-3":
			return getKorunkaNa3Lotteries(bet);

		case "korunka-na-4":
			return getKorunkaNa4Lotteries(bet);

		case "korunka-na-5":
			return getKorunkaNa5Lotteries(bet);

		case "sportka":
			return getSportkaLotteries(bet);

		case "stastnych10":
			return getStastnych10Lotteries(bet);

		case "eurojackpot":
			return getEurojackpotLotteries(bet);

		case "kasicka":
			return getKasickaLotteries(bet);

		default:
	}

	return [];
}

export function completeGames(noNotification?: boolean): {
	count: number;
	price: number;
	highestPrice: number;
} {
	const store = sazkaStore.getState();

	// slosujeme cisla
	const kackaNumbers = getRychleKackyNumbers();
	const sportkaData = getSportkaData();
	const rychla6Numbers = getRychla6Numbers();
	const korunkaNa3Numbers = getKorunkaNa3Numbers();
	const korunkaNa4Numbers = getKorunkaNa4Numbers();
	const korunkaNa5Numbers = getKorunkaNa5Numbers();
	const stastnych10Data = getStastnych10Data();
	const eurojackpotData = getEurojackpotData();
	const kasickaNumbers = getKasickaNumbers();
	//
	const toBeDone = store.sazka.bets.filter(item => item.state !== "completed");

	if (toBeDone.length > 0) {
		notificationStore.getState().setNotification(`Slosování...`);

		let allPrices = 0;
		let highestPrice = 0;

		toBeDone.forEach(bet => {
			if (bet.state !== "completed") {
				let curPrice = 0;

				switch (bet.type) {
					case "rychle-kacky":
						curPrice = completeRychleKacky(bet.id, bet.rychleKacky, kackaNumbers);
						break;

					case "rychla6":
						curPrice = completeRychla6(bet.id, bet.rychla6, rychla6Numbers);
						break;

					case "korunka-na-3":
						curPrice = completeKorunkaNa3(bet.id, bet.korunkaNa3, korunkaNa3Numbers);
						break;

					case "korunka-na-4":
						curPrice = completeKorunkaNa4(bet.id, bet.korunkaNa4, korunkaNa4Numbers);
						break;

					case "korunka-na-5":
						curPrice = completeKorunkaNa5(bet.id, bet.korunkaNa5, korunkaNa5Numbers);
						break;

					case "sportka":
						curPrice = completeSportka(bet.id, bet.sportka, sportkaData);
						break;

					case "stastnych10":
						curPrice = completeStastnych10(bet.id, bet.stastnych10, stastnych10Data);
						break;

					case "eurojackpot":
						curPrice = completeEurojackpot(bet.id, bet.eurojackpot, eurojackpotData);
						break;

					case "kasicka":
						curPrice = completeKasicka(bet.id, bet.kasicka, kasickaNumbers);
						break;

					default:
				}

				highestPrice = Math.max(highestPrice, curPrice);
				allPrices += curPrice;
			}
		});

		!noNotification && notificationStore.getState().setNotification(`Počet sázek ${toBeDone.length}, výhra ${formatPrice(allPrices)}, nejvyšší výhra ${formatPrice(highestPrice)}`, allPrices === 0 ? "red" : "green");

		return {
			count: toBeDone.length,
			price: allPrices,
			highestPrice,
		};
	}

	return {
		count: 0,
		price: 0,
		highestPrice: 0,
	};
}

export function completeAllGames() {
	/* eslint-disable no-constant-condition */
	let count = 0;
	let price = 0;
	let highestPrice = 0;

	while (true) {
		const data = completeGames(true);
		const store = sazkaStore.getState();
		const toBeDone = store.sazka.bets.filter(item => item.state !== "completed");

		count += data.count;
		price += data.price;
		highestPrice = Math.max(data.highestPrice, highestPrice);

		if (toBeDone.length === 0) {
			break;
		}
	}

	notificationStore.getState().setNotification(`Počet sázek ${count}, výhra ${formatPrice(price)}, nejvyšší výhra ${formatPrice(highestPrice)}`, price === 0 ? "red" : "green");
}
