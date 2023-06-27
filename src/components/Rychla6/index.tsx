/* eslint-disable no-magic-numbers */
import MyButton from "~/my/MyButton";
import { formatPrice, generateRychla6 } from "~/utils/utils";
import Rychla6Bet from "~/components/Rychla6Bet";
import { gameRychla6, allInRychla6 } from "~/providers/sazka";
import { RYCHLA6 } from "~/const";
import { myUseState } from "~/hooks/myUseState";
import { notificationStore } from "~/stores/notification";

import "./style.less";

interface IState {
	showRychla6Bet: boolean;
}

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
	title: "Chci hrát až o 100 000 Kč",
	bet: RYCHLA6.bets[0],
	drawCount: 1,
	price: RYCHLA6.bets[0],
}, {
	id: 1,
	title: "Zlatý střed",
	bet: RYCHLA6.bets[0],
	drawCount: 5,
	price: RYCHLA6.bets[0] * 5,
}];

export default function Rychla6({
	amount,
}: IRychla6) {
	const { state, updateState } = myUseState<IState>({
		showRychla6Bet: false,
	});

	function addGame(item: IItem) {
		const msg = gameRychla6(generateRychla6(), item.bet, item.drawCount);

		notificationStore.getState().setNotification(msg);
	}

	function allIn(item: IItem) {
		const msg = allInRychla6(item.bet, item.drawCount);

		notificationStore.getState().setNotification(msg);
	}

	return <div className="rychla6Container">
		<h2 className="rychla6Container__title">
			Rychlá 6
		</h2>
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
			<div className="rychla6Container__quickItem last">
				<MyButton text="Vsadit online" onClick={() => updateState({ showRychla6Bet: true })} />
			</div>
			{ state.showRychla6Bet && <Rychla6Bet onClose={() => updateState({ showRychla6Bet: false })} /> }
		</div>
	</div>;
}
