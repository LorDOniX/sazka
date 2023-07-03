/* eslint-disable no-magic-numbers */
import MyButton from "~/my/MyButton";
import { formatPrice } from "~/utils/utils";
import { generateRychla6, gameRychla6, allInRychla6 } from "~/games/rychla6";
import { RYCHLA6 } from "~/games/rychla6/const";
import { notificationStore } from "~/stores/notification";
import { ROUTES } from "~/const";
import GameTitle from "~/components/GameTitle";

import Rychla6Img from "~/assets/sazka/rychla6.jpg";

import "./style.less";

interface IRychla6 {
	amount: number;
}

interface IItem {
	id: number;
	title: string;
	bet: number;
	drawCount: number;
	price: number;
}

const items: Array<IItem> = [{
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
	id: 2,
	title: "Hrajte na max",
	bet: RYCHLA6.bets[RYCHLA6.bets.length - 1],
	drawCount: RYCHLA6.maxDrawCount,
	price: RYCHLA6.bets[RYCHLA6.bets.length - 1] * RYCHLA6.maxDrawCount,
}];

export default function Rychla6({
	amount,
}: IRychla6) {
	function addGame(item: IItem) {
		const msg = gameRychla6(generateRychla6(), item.bet, item.drawCount);

		notificationStore.getState().setNotification(msg);
	}

	function allIn(item: IItem) {
		const msg = allInRychla6(item.bet, item.drawCount);

		notificationStore.getState().setNotification(msg);
	}

	return <div className="rychla6Container">
		<GameTitle title="Rychlá 6" img={Rychla6Img} link={ROUTES.RYCHLA6} />
		<div className="rychla6Container__quickItems">
			{ items.map(item => <div key={item.id} className="rychla6Container__quickItem">
				<h3 className="rychla6Container__quickItemTitle">
					{ item.title }
				</h3>
				<span className="rychla6Container__quickItemSeparator" />
				<p className="rychla6Container__quickItemParagraph">
					Hlavní hra za <strong>{ formatPrice(item.bet) }</strong>
				</p>
				<p className="rychla6Container__quickItemParagraph">
					Na <strong>{ item.drawCount }</strong> slosování
				</p>
				<MyButton className="rychla6Container__quickItemBetBtn" text={`Vsadit za ${formatPrice(item.price)}`} onClick={() => addGame(item)}
					disabled={item.price > amount} />
				<MyButton className="rychla6Container__quickItemBetBtn second" text="Vsadit vše" onClick={() => allIn(item)} disabled={item.price > amount} />
			</div>) }
		</div>
	</div>;
}
