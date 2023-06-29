/* eslint-disable no-magic-numbers */
import MyButton from "~/my/MyButton";
import { formatPrice } from "~/utils/utils";
import { KORUNKA_NA4 } from "~/games/korunka-na4/const";
import { notificationStore } from "~/stores/notification";
import { generateKorunkaNa4, gameKorunkaNa4, allInRychlaKorunkaNa4 } from "~/games/korunka-na4";
import { ROUTES } from "~/const";
import GameTitle from "~/components/GameTitle";

import KorunkaNa4Img from "~/assets/sazka/korunka4.png";

import "./style.less";

interface IKorunkaNa4 {
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
	title: `Hrát za ${formatPrice(KORUNKA_NA4.bets[0])}`,
	bet: KORUNKA_NA4.bets[0],
	drawCount: 1,
	price: KORUNKA_NA4.bets[0],
}, {
	id: 1,
	title: "10 slosování",
	bet: KORUNKA_NA4.bets[0],
	drawCount: 10,
	price: KORUNKA_NA4.bets[0] * 10,
}, {
	id: 2,
	title: "Nejvyšší výhra",
	bet: KORUNKA_NA4.bets[KORUNKA_NA4.bets.length - 1],
	drawCount: 10,
	price: KORUNKA_NA4.bets[KORUNKA_NA4.bets.length - 1] * 10,
}];

export default function KorunkaNa4({
	amount,
}: IKorunkaNa4) {
	function addGame(item: IItem) {
		const msg = gameKorunkaNa4(generateKorunkaNa4(), item.bet, item.drawCount);

		notificationStore.getState().setNotification(msg);
	}

	function allIn(item: IItem) {
		const msg = allInRychlaKorunkaNa4(item.bet, item.drawCount);

		notificationStore.getState().setNotification(msg);
	}

	return <div className="korunkaNa4Container">
		<GameTitle title="Korunka na 4" img={KorunkaNa4Img} link={ROUTES.KORUNKA_NA4} />
		<div className="korunkaNa4Container__quickItems">
			{ items.map(item => <div key={item.id} className="korunkaNa4Container__quickItem">
				<h3 className="korunkaNa4Container__quickItemTitle">
					{ item.title }
				</h3>
				<span className="korunkaNa4Container__quickItemSeparator" />
				<p className="korunkaNa4Container__quickItemParagraph">
					Hlavní hra za <strong>{ formatPrice(item.price) }</strong>
				</p>
				<p className="korunkaNa4Container__quickItemParagraph">
					Na <strong>{ item.drawCount }</strong> slosování
				</p>
				<MyButton className="korunkaNa4Container__quickItemBetBtn" text={`Vsadit za ${formatPrice(item.price)}`} onClick={() => addGame(item)}
					disabled={item.price > amount} />
				<MyButton className="korunkaNa4Container__quickItemBetBtn second" text="Vsadit vše" onClick={() => allIn(item)} disabled={item.price > amount} />
			</div>) }
		</div>
	</div>;
}
