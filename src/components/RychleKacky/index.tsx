/* eslint-disable no-magic-numbers */
import MyButton from "~/my/MyButton";
import { formatPrice } from "~/utils/utils";
import { gameRychleKacky, allInRychleKacky, generateRychleKacky } from "~/games/rychle-kacky";
import { RYCHLE_KACKY } from "~/games/rychle-kacky/const";
import { notificationStore } from "~/stores/notification";
import { ROUTES } from "~/const";
import GameTitle from "~/components/GameTitle";

import RychleKackyImg from "~/assets/sazka/rychleKacky.jpg";

import "./style.less";

interface IRychleKacky {
	amount: number;
}

interface IItem {
	id: number;
	guessedNumbers: number;
	bet: number;
	drawCount: number;
	price: number;
}

const FIRST_ITEM = {
	bet: 10,
	drawCount: 2,
};

const SECOND_ITEM = {
	bet: 10,
	drawCount: 5,
};

const THIRD_ITEM = {
	bet: 20,
	drawCount: 5,
};

const items: Array<IItem> = [{
	id: 0,
	guessedNumbers: RYCHLE_KACKY.guessedNumbersMax,
	bet: FIRST_ITEM.bet,
	drawCount: FIRST_ITEM.drawCount,
	price: FIRST_ITEM.bet * FIRST_ITEM.drawCount,
}, {
	id: 1,
	guessedNumbers: RYCHLE_KACKY.guessedNumbersMax,
	bet: SECOND_ITEM.bet,
	drawCount: SECOND_ITEM.drawCount,
	price: SECOND_ITEM.bet * SECOND_ITEM.drawCount,
}, {
	id: 2,
	guessedNumbers: RYCHLE_KACKY.guessedNumbersMax,
	bet: THIRD_ITEM.bet,
	drawCount: THIRD_ITEM.drawCount,
	price: THIRD_ITEM.bet * THIRD_ITEM.drawCount,
}];

export default function RychleKacky({
	amount,
}: IRychleKacky) {
	function addGame(item: IItem) {
		const msg = gameRychleKacky(generateRychleKacky(item.guessedNumbers), item.bet, item.drawCount);

		notificationStore.getState().setNotification(msg);
	}

	function allIn(item: IItem) {
		const msg = allInRychleKacky(item.guessedNumbers, item.bet, item.drawCount);

		notificationStore.getState().setNotification(msg);
	}

	return <div className="rychleKackyContainer">
		<GameTitle title="Rychlé kačky" img={RychleKackyImg} link={ROUTES.RYCHLE_KACKY} />
		<div className="rychleKackyContainer__quickItems">
			{ items.map(item => <div key={item.id} className="rychleKackyContainer__quickItem">
				<h3 className="rychleKackyContainer__quickItemTitle">
					Rychlá sázka
				</h3>
				<span className="rychleKackyContainer__quickItemSeparator" />
				<p className="rychleKackyContainer__quickItemParagraph">
					<strong>{ item.guessedNumbers }</strong> za <strong>{ formatPrice(item.bet) }</strong>
				</p>
				<p className="rychleKackyContainer__quickItemParagraph">
					<strong>{ item.drawCount }</strong> slosování
				</p>
				<MyButton className="rychleKackyContainer__quickItemBetBtn" text={`Vsadit za ${formatPrice(item.price)}`} onClick={() => addGame(item)}
					disabled={item.price > amount} />
				<MyButton className="rychleKackyContainer__quickItemBetBtn second" text="Vsadit vše" onClick={() => allIn(item)} disabled={item.price > amount} />
			</div>) }
		</div>
	</div>;
}
