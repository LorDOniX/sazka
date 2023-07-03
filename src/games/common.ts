import { formatDate, formatPrice } from "~/utils/utils";
import { IBet, IBetInfo, ILotteryItem } from "~/interfaces";
import { completeRychleKacky, getRychleKackyBetInfo, getRychleKackyNumbers } from "~/games/rychle-kacky";
import { completeRychla6, getRychla6BetInfo, getRychla6Lotteries, getRychla6Numbers } from "~/games/rychla6";
import { completeKorunkaNa3, getKorunkaNa3BetInfo, getKorunkaNa3Lotteries, getKorunkaNa3Numbers } from "~/games/korunka-na3";
import { completeKorunkaNa4, getKorunkaNa4BetInfo, getKorunkaNa4Lotteries, getKorunkaNa4Numbers } from "~/games/korunka-na4";
import { completeKorunkaNa5, getKorunkaNa5BetInfo, getKorunkaNa5Lotteries, getKorunkaNa5Numbers } from "~/games/korunka-na5";
import { completeSportka, getSportkaBetInfo, getSportkaData, getSportkaLotteries } from "~/games/sportka";
import { sazkaStore } from "~/stores/sazka";
import { notificationStore } from "~/stores/notification";
import { completeStastnych10, getStastnych10BetInfo, getStastnych10Data, getStastnych10Lotteries } from "./stastnych10";

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

		default:
	}

	return output;
}

export function getLotteries(bet: IBet): Array<ILotteryItem> {
	switch (bet.type) {
		case "rychle-kacky":
			return getKorunkaNa3Lotteries(bet);

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

		default:
	}

	return [];
}


export function completeGames() {
	const store = sazkaStore.getState();

	// slosujeme cisla
	const kackaNumbers = getRychleKackyNumbers();
	const sportkaData = getSportkaData();
	const rychla6Numbers = getRychla6Numbers();
	const KorunkaNa3Numbers = getKorunkaNa3Numbers();
	const KorunkaNa4Numbers = getKorunkaNa4Numbers();
	const KorunkaNa5Numbers = getKorunkaNa5Numbers();
	const Stastnych10Data = getStastnych10Data();
	const toBeDone = store.sazka.bets.filter(item => item.state !== "completed");

	if (toBeDone.length > 0) {
		notificationStore.getState().setNotification(`Slosování...`);

		let allPrices = 0;

		toBeDone.forEach(bet => {
			if (bet.state !== "completed") {
				switch (bet.type) {
					case "rychle-kacky":
						allPrices += completeRychleKacky(bet.id, bet.rychleKacky, kackaNumbers);
						break;

					case "rychla6":
						allPrices += completeRychla6(bet.id, bet.rychla6, rychla6Numbers);
						break;

					case "korunka-na-3":
						allPrices += completeKorunkaNa3(bet.id, bet.korunkaNa3, KorunkaNa3Numbers);
						break;

					case "korunka-na-4":
						allPrices += completeKorunkaNa4(bet.id, bet.korunkaNa4, KorunkaNa4Numbers);
						break;

					case "korunka-na-5":
						allPrices += completeKorunkaNa5(bet.id, bet.korunkaNa5, KorunkaNa5Numbers);
						break;

					case "sportka":
						allPrices += completeSportka(bet.id, bet.sportka, sportkaData);
						break;

					case "stastnych10":
						allPrices += completeStastnych10(bet.id, bet.stastnych10, Stastnych10Data);
						break;

					default:
				}
			}
		});

		notificationStore.getState().setNotification(`Počet sázek ${toBeDone.length}, výhra ${formatPrice(allPrices)}`, allPrices === 0 ? "red" : "green");
	}
}
