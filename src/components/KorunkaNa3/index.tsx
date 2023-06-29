/* eslint-disable no-magic-numbers */
import MyButton from "~/my/MyButton";
import { formatPrice } from "~/utils/utils";
import KorunkaNa3Bet from "~/components/KorunkaNa3Bet";
import { KORUNKA_NA3 } from "~/const";
import { myUseState } from "~/hooks/myUseState";
import { notificationStore } from "~/stores/notification";
import { generateKorunkaNa3, gameKorunkaNa3, allInRychlaKorunkaNa3 } from "~/games/korunka-na3";

import "./style.less";

interface IState {
	showKorunkaNa3Bet: boolean;
}

interface IKorunkaNa3 {
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
	title: `Hrát za ${formatPrice(KORUNKA_NA3.bets[0])}`,
	bet: KORUNKA_NA3.bets[0],
	drawCount: 1,
	price: KORUNKA_NA3.bets[0],
}, {
	id: 1,
	title: "10 slosování",
	bet: KORUNKA_NA3.bets[0],
	drawCount: 10,
	price: KORUNKA_NA3.bets[0] * 10,
}, {
	id: 2,
	title: "Nejvyšší výhra",
	bet: KORUNKA_NA3.bets[KORUNKA_NA3.bets.length - 1],
	drawCount: 10,
	price: KORUNKA_NA3.bets[KORUNKA_NA3.bets.length - 1] * 10,
}];

export default function KorunkaNa3({
	amount,
}: IKorunkaNa3) {
	const { state, updateState } = myUseState<IState>({
		showKorunkaNa3Bet: false,
	});

	function addGame(item: IItem) {
		const msg = gameKorunkaNa3(generateKorunkaNa3(), item.bet, item.drawCount);

		notificationStore.getState().setNotification(msg);
	}

	function allIn(item: IItem) {
		const msg = allInRychlaKorunkaNa3(item.bet, item.drawCount);

		notificationStore.getState().setNotification(msg);
	}

	return <div className="korunkaNa3Container">
		<h2 className="korunkaNa3Container__title">
			Korunka na 3
		</h2>
		<div className="korunkaNa3Container__quickItems">
			{ items.map(item => <div key={item.id} className="korunkaNa3Container__quickItem">
				<h3 className="korunkaNa3Container__quickItemTitle">
					{ item.title }
				</h3>
				<span className="korunkaNa3Container__quickItemSeparator" />
				<p className="korunkaNa3Container__quickItemParagraph">
					Hlavní hra za <strong>{ formatPrice(item.price) }</strong>
				</p>
				<p className="korunkaNa3Container__quickItemParagraph">
					Na <strong>{ item.drawCount }</strong> slosování
				</p>
				<MyButton className="korunkaNa3Container__quickItemBetBtn" text={`Vsadit za ${formatPrice(item.price)}`} onClick={() => addGame(item)}
					disabled={item.price > amount} />
				<MyButton className="korunkaNa3Container__quickItemBetBtn second" text="Vsadit vše" onClick={() => allIn(item)} disabled={item.price > amount} />
			</div>) }
			<div className="korunkaNa3Container__quickItem last">
				<MyButton text="Vsadit online" onClick={() => updateState({ showKorunkaNa3Bet: true })} />
			</div>
			{ state.showKorunkaNa3Bet && <KorunkaNa3Bet onClose={() => updateState({ showKorunkaNa3Bet: false })} /> }
		</div>
	</div>;
}
