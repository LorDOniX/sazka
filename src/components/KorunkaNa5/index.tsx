/* eslint-disable no-magic-numbers */
import MyButton from "~/my/MyButton";
import { formatPrice } from "~/utils/utils";
import { KORUNKA_NA5 } from "~/games/korunka-na5/const";
import { notificationStore } from "~/stores/notification";
import { generateKorunkaNa5, gameKorunkaNa5, allInRychlaKorunkaNa5 } from "~/games/korunka-na5";
import { ROUTES } from "~/const";
import GameTitle from "~/components/GameTitle";

import KorunkaNa5Img from "~/assets/sazka/korunka5.png";

import "./style.less";

interface IKorunkaNa5 {
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
	title: `Hrát za ${formatPrice(KORUNKA_NA5.bets[0])}`,
	bet: KORUNKA_NA5.bets[0],
	drawCount: 1,
	price: KORUNKA_NA5.bets[0],
}, {
	id: 1,
	title: "10 slosování",
	bet: KORUNKA_NA5.bets[0],
	drawCount: 10,
	price: KORUNKA_NA5.bets[0] * 10,
}, {
	id: 2,
	title: "Nejvyšší výhra",
	bet: KORUNKA_NA5.bets[KORUNKA_NA5.bets.length - 1],
	drawCount: 10,
	price: KORUNKA_NA5.bets[KORUNKA_NA5.bets.length - 1] * 10,
}];

export default function KorunkaNa5({
	amount,
}: IKorunkaNa5) {
	function addGame(item: IItem) {
		const msg = gameKorunkaNa5(generateKorunkaNa5(), item.bet, item.drawCount);

		notificationStore.getState().setNotification(msg);
	}

	function allIn(item: IItem) {
		const msg = allInRychlaKorunkaNa5(item.bet, item.drawCount);

		notificationStore.getState().setNotification(msg);
	}

	return <div className="korunkaNa5Container">
		<GameTitle title="Korunka na 5" img={KorunkaNa5Img} link={ROUTES.KORUNKA_NA5} />
		<div className="korunkaNa5Container__quickItems">
			{ items.map(item => <div key={item.id} className="korunkaNa5Container__quickItem">
				<h3 className="korunkaNa5Container__quickItemTitle">
					{ item.title }
				</h3>
				<span className="korunkaNa5Container__quickItemSeparator" />
				<p className="korunkaNa5Container__quickItemParagraph">
					Hlavní hra za <strong>{ formatPrice(item.price) }</strong>
				</p>
				<p className="korunkaNa5Container__quickItemParagraph">
					Na <strong>{ item.drawCount }</strong> slosování
				</p>
				<MyButton className="korunkaNa5Container__quickItemBetBtn" text={`Vsadit za ${formatPrice(item.price)}`} onClick={() => addGame(item)}
					disabled={item.price > amount} />
				<MyButton className="korunkaNa5Container__quickItemBetBtn second" text="Vsadit vše" onClick={() => allIn(item)} disabled={item.price > amount} />
			</div>) }
		</div>
	</div>;
}
