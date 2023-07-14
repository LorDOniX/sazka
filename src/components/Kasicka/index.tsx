/* eslint-disable no-magic-numbers */
import MyButton from "~/my/MyButton";
import { formatPrice } from "~/utils/utils";
import { generateKasicka, gameKasicka, allInKasicka, getKasickaCover, getKasickaPrice } from "~/games/kasicka";
import { KASICKA } from "~/games/kasicka/const";
import { notificationStore } from "~/stores/notification";
import { ROUTES } from "~/const";
import GameTitle from "~/components/GameTitle";

import "./style.less";

interface IKasicka {
	amount: number;
}

interface IItem {
	id: number;
	drawNumbers: number;
	title: string;
	line1: string;
	line2: string;
	price: number;
	bet: number;
	betRatio: number;
}

const items: Array<IItem> = [{
	id: 0,
	drawNumbers: KASICKA.guessedNumbers[KASICKA.guessedNumbers.length - 1],
	title: "Náhodný tip",
	line1: `${KASICKA.guessedNumbers[KASICKA.guessedNumbers.length - 1]} čísel`,
	line2: `Za ${formatPrice(getKasickaPrice(KASICKA.bet, 5))} na 1 slosování`,
	price: getKasickaPrice(KASICKA.bet, 5),
	bet: KASICKA.bet,
	betRatio: 5,
}, {
	id: 1,
	drawNumbers: KASICKA.guessedNumbers[KASICKA.guessedNumbers.length - 1],
	title: "Náhodný tip",
	line1: `${KASICKA.guessedNumbers[KASICKA.guessedNumbers.length - 1]} čísel`,
	line2: `Za ${formatPrice(getKasickaPrice(KASICKA.bet, 1))} na 1 slosování`,
	price: getKasickaPrice(KASICKA.bet, 1),
	bet: KASICKA.bet,
	betRatio: 1,
}, {
	id: 2,
	drawNumbers: KASICKA.guessedNumbers[1],
	title: "Náhodný tip",
	line1: `${KASICKA.guessedNumbers[1]} čísla`,
	line2: `Za ${formatPrice(getKasickaPrice(KASICKA.bet, 1))} na 1 slosování`,
	price: getKasickaPrice(KASICKA.bet, 1),
	bet: KASICKA.bet,
	betRatio: 1,
}];

export default function Kasicka({
	amount,
}: IKasicka) {
	function addGame(item: IItem, generatedData?: ReturnType<typeof generateKasicka>) {
		const gameData = generatedData || generateKasicka(item.drawNumbers);
		const msg = gameKasicka(gameData, item.bet, item.betRatio);

		notificationStore.getState().setNotification(msg);
	}

	function allIn(item: IItem) {
		const msg = allInKasicka(item.drawNumbers, item.bet, item.betRatio);

		notificationStore.getState().setNotification(msg);
	}

	function createItem(item: IItem, addGameCb: () => void, allInCb?: () => void) {
		return <div key={item.id} className="kasickaContainer__quickItem">
			<h3 className="kasickaContainer__quickItemTitle">
				{ item.title }
			</h3>
			<span className="kasickaContainer__quickItemSeparator" />
			<p className="kasickaContainer__quickItemParagraph">
				{ item.line1 }
			</p>
			<p className="kasickaContainer__quickItemParagraph">
				{ item.line2 }
			</p>
			<MyButton className="kasickaContainer__quickItemBetBtn" text={`Vsadit za ${formatPrice(item.price)}`} onClick={addGameCb}
				disabled={item.price > amount} />
			<MyButton className="kasickaContainer__quickItemBetBtn second" text="Vsadit vše" onClick={allInCb} disabled={item.price > amount || !allInCb} />
		</div>;
	}

	return <div className="kasickaContainer">
		<GameTitle title="Kasička" img={getKasickaCover()} link={ROUTES.KASICKA} />
		<div className="kasickaContainer__quickItems">
			{ items.map(item => createItem(item, () => addGame(item), () => allIn(item))) }
		</div>
	</div>;
}
