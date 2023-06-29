/* eslint-disable no-magic-numbers */
import MyButton from "~/my/MyButton";
import { formatPrice, formatColumns } from "~/utils/utils";
import { generateSportkaGame, gameSportka, allInSportka, generateFavouriteTicket } from "~/games/sportka";
import { SPORTKA } from "~/games/sportka/const";
import { notificationStore } from "~/stores/notification";
import { ROUTES } from "~/const";
import GameTitle from "~/components/GameTitle";

import SportkaImg from "~/assets/sazka/sportka.jpg";

import "./style.less";

interface ISportka {
	amount: number;
}

interface IItem {
	id: number;
	columns: number;
	hasSuperJackpot: boolean;
	chance: boolean;
	title: string;
	line1: string;
	line2: string;
	line3: string;
	price: number;
}

const MIDDLE_COLUMNS = 5;
const RIGHT_COLUMNS = 1;

const items: Array<IItem> = [{
	id: 0,
	columns: SPORTKA.maxColumns,
	hasSuperJackpot: true,
	chance: true,
	title: "Plný ticket",
	line1: "Hra o superjackpot",
	line2: formatColumns(SPORTKA.maxColumns),
	line3: "Včetně šance",
	price: (SPORTKA.maxColumns * SPORTKA.pricePerColumn) + SPORTKA.chancePrice,
}, {
	id: 1,
	columns: MIDDLE_COLUMNS,
	hasSuperJackpot: false,
	chance: true,
	title: `${formatColumns(MIDDLE_COLUMNS)} a Šance`,
	line1: formatColumns(MIDDLE_COLUMNS),
	line2: "Včetně Šance",
	line3: "Na 1 slosování",
	price: (MIDDLE_COLUMNS * SPORTKA.pricePerColumn) + SPORTKA.chancePrice,
}, {
	id: 2,
	columns: RIGHT_COLUMNS,
	hasSuperJackpot: false,
	chance: true,
	title: "Na zkoušku",
	line1: formatColumns(RIGHT_COLUMNS),
	line2: "Včetně Šance",
	line3: "Na 1 slosování",
	price: (RIGHT_COLUMNS * SPORTKA.pricePerColumn) + SPORTKA.chancePrice,
}];
const myNumbers: IItem = {
	id: 3,
	columns: SPORTKA.maxColumns,
	hasSuperJackpot: true,
	chance: true,
	title: "Oblíbená čísla",
	line1: "Hra o superjackpot",
	line2: formatColumns(SPORTKA.maxColumns),
	line3: "Včetně šance",
	price: (SPORTKA.maxColumns * SPORTKA.pricePerColumn) + SPORTKA.chancePrice,
};

export default function Sportka({
	amount,
}: ISportka) {
	function addGame(item: IItem, generatedData?: ReturnType<typeof generateSportkaGame>) {
		const gameData = generatedData || generateSportkaGame(item.columns, item.chance);
		const msg = gameSportka(gameData.columns, gameData.chance);

		notificationStore.getState().setNotification(msg);
	}

	function allIn(item: IItem) {
		const msg = allInSportka(item.columns, item.chance);

		notificationStore.getState().setNotification(msg);
	}

	function createItem(item: IItem, addGameCb: () => void, allInCb?: () => void) {
		return <div key={item.id} className="sportkaContainer__quickItem">
			<h3 className="sportkaContainer__quickItemTitle">
				{ item.title }
			</h3>
			<span className="sportkaContainer__quickItemSeparator" />
			<p className="sportkaContainer__quickItemParagraph">
				{ item.hasSuperJackpot && <strong>{ item.line1 }</strong> }
				{ !item.hasSuperJackpot && item.line1 }
			</p>
			<p className="sportkaContainer__quickItemParagraph">
				{ item.line2 }
			</p>
			<p className="sportkaContainer__quickItemParagraph">
				{ item.line3 }
			</p>
			<MyButton className="sportkaContainer__quickItemBetBtn" text={`Vsadit za ${formatPrice(item.price)}`} onClick={addGameCb}
				disabled={item.price > amount} />
			<MyButton className="sportkaContainer__quickItemBetBtn second" text="Vsadit vše" onClick={allInCb} disabled={item.price > amount || !allInCb} />
		</div>;
	}

	return <div className="sportkaContainer">
		<GameTitle title="Sportka" img={SportkaImg} link={ROUTES.SPORTKA} />
		<div className="sportkaContainer__quickItems">
			{ items.map(item => createItem(item, () => addGame(item), () => allIn(item))) }
			{ createItem(myNumbers, () => addGame(myNumbers, generateFavouriteTicket())) }
		</div>
	</div>;
}
