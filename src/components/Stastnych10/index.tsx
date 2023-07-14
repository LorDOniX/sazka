/* eslint-disable no-magic-numbers */
import MyButton from "~/my/MyButton";
import { formatPrice } from "~/utils/utils";
import { generateStastnych10Game, gameStastnych10, allInStastnych10, getStastnych10Cover, getStastnych10PriceData } from "~/games/stastnych10";
import { notificationStore } from "~/stores/notification";
import { ROUTES } from "~/const";
import GameTitle from "~/components/GameTitle";
import { STASTNYCH10 } from "~/games/stastnych10/const";

import "./style.less";

interface IStastnych10 {
	amount: number;
}

interface IItem {
	id: number;
	columns: number;
	count: number;
	bet: number;
	kingGame: boolean;
	chance: boolean;
	title: string;
	line1: string;
	line2: string;
	price: number;
}

const items: Array<IItem> = [{
	id: 4,
	columns: STASTNYCH10.maxColumns,
	count: 10,
	kingGame: true,
	bet: STASTNYCH10.pricesPerColumn[0],
	chance: true,
	title: "Šance na miliony",
	line1: "4 x 10 čísel",
	line2: "Včetně Šance milion a Královské hry",
	price: getStastnych10PriceData([
		{ bet: STASTNYCH10.pricesPerColumn[0], index: 0, guessedNumbers: [], kingGame: true, price: 0 },
		{ bet: STASTNYCH10.pricesPerColumn[0], index: 0, guessedNumbers: [], kingGame: true, price: 0 },
		{ bet: STASTNYCH10.pricesPerColumn[0], index: 0, guessedNumbers: [], kingGame: true, price: 0 },
		{ bet: STASTNYCH10.pricesPerColumn[0], index: 0, guessedNumbers: [], kingGame: true, price: 0 },
	], true).price,
}, {
	id: 0,
	columns: 2,
	count: 10,
	kingGame: true,
	bet: STASTNYCH10.pricesPerColumn[0],
	chance: true,
	title: "Šance na miliony",
	line1: "2 x 10 čísel",
	line2: "Včetně Šance milion a Královské hry",
	price: getStastnych10PriceData([
		{ bet: STASTNYCH10.pricesPerColumn[0], index: 0, guessedNumbers: [], kingGame: true, price: 0 },
		{ bet: STASTNYCH10.pricesPerColumn[0], index: 0, guessedNumbers: [], kingGame: true, price: 0 },
	], true).price,
}, {
	id: 1,
	columns: 1,
	count: 10,
	kingGame: true,
	bet: STASTNYCH10.pricesPerColumn[0],
	chance: true,
	title: "Sloupek s Královskou",
	line1: "10 čísel",
	line2: "Včetně Šance milion a Královské hry",
	price: getStastnych10PriceData([
		{ bet: STASTNYCH10.pricesPerColumn[0], index: 0, guessedNumbers: [], kingGame: true, price: 0 },
	], true).price,
}, {
	id: 2,
	columns: 1,
	count: 10,
	kingGame: false,
	bet: STASTNYCH10.pricesPerColumn[0],
	chance: true,
	title: "Na zkoušku",
	line1: "10 čísel",
	line2: "Včetně Šance milion",
	price: getStastnych10PriceData([
		{ bet: STASTNYCH10.pricesPerColumn[0], index: 0, guessedNumbers: [], kingGame: false, price: 0 },
	], true).price,
}, {
	id: 3,
	columns: 4,
	count: 10,
	kingGame: true,
	bet: STASTNYCH10.pricesPerColumn[STASTNYCH10.pricesPerColumn.length - 1],
	chance: true,
	title: "Max",
	line1: "10 čísel",
	line2: "Včetně Šance milion a Královské hry",
	price: getStastnych10PriceData([
		{ bet: STASTNYCH10.pricesPerColumn[STASTNYCH10.pricesPerColumn.length - 1], index: 0, guessedNumbers: [], kingGame: true, price: 0 },
		{ bet: STASTNYCH10.pricesPerColumn[STASTNYCH10.pricesPerColumn.length - 1], index: 1, guessedNumbers: [], kingGame: true, price: 0 },
		{ bet: STASTNYCH10.pricesPerColumn[STASTNYCH10.pricesPerColumn.length - 1], index: 2, guessedNumbers: [], kingGame: true, price: 0 },
		{ bet: STASTNYCH10.pricesPerColumn[STASTNYCH10.pricesPerColumn.length - 1], index: 3, guessedNumbers: [], kingGame: true, price: 0 },
	], true).price,
}];

export default function Stastnych10({
	amount,
}: IStastnych10) {
	function addGame(item: IItem) {
		const gameData = generateStastnych10Game(item.count, item.bet, item.kingGame, item.columns, item.chance);
		const msg = gameStastnych10(gameData.columns, gameData.chance);

		notificationStore.getState().setNotification(msg);
	}

	function allIn(item: IItem) {
		const gameData = generateStastnych10Game(item.count, item.bet, item.kingGame, item.columns, item.chance);
		const msg = allInStastnych10(item.count, item.bet, item.kingGame, gameData.columns, item.chance);

		notificationStore.getState().setNotification(msg);
	}

	function createItem(item: IItem, addGameCb: () => void, allInCb?: () => void) {
		return <div key={item.id} className="stastnych10Container__quickItem">
			<div className="stastnych10Container__quickItemTopPart">
				<h3 className="stastnych10Container__quickItemTitle">
					{ item.title }
				</h3>
				<span className="stastnych10Container__quickItemSeparator" />
			</div>
			<div className="stastnych10Container__quickItemMiddlePart">
				<p className="stastnych10Container__quickItemParagraph">
					{ item.line1 }
				</p>
				<p className="stastnych10Container__quickItemParagraph">
					{ item.line2 }
				</p>
			</div>
			<div className="stastnych10Container__quickItemBottomPart">
				<MyButton className="stastnych10Container__quickItemBetBtn" text={`Vsadit za ${formatPrice(item.price)}`} onClick={addGameCb}
					disabled={item.price > amount} />
				<MyButton className="stastnych10Container__quickItemBetBtn second" text="Vsadit vše" onClick={allInCb} disabled={item.price > amount || !allInCb} />
			</div>
		</div>;
	}

	return <div className="stastnych10Container">
		<GameTitle title="Šťastných 10" img={getStastnych10Cover()} link={ROUTES.STASTNYCH10} />
		<div className="stastnych10Container__quickItems">
			{ items.map(item => createItem(item, () => addGame(item), () => allIn(item))) }
		</div>
	</div>;
}
