import MyButton from "~/my/MyButton";
import { formatPrice } from "~/utils/utils";
import { gameRychleKacky, allInRychleKacky, generateRychleKacky, getRychleKackyCover, getRychleKackyQuickItems } from "~/games/rychle-kacky";
import { notificationStore } from "~/stores/notification";
import { ROUTES } from "~/const";
import GameTitle from "~/components/GameTitle";
import AllInModal from "~/components/AllInModal";
import { myUseState } from "~/hooks/myUseState";
import { IRychleKackyQuickItem } from "~/games/rychle-kacky/interfaces";
import { completeAllGames } from "~/games/common";

import "./style.less";

interface IRychleKacky {
	amount: number;
}

interface IState {
	item: IRychleKackyQuickItem;
}

export default function RychleKacky({
	amount,
}: IRychleKacky) {
	const { state, updateState } = myUseState<IState>({
		item: null,
	});

	function addGame(item: IRychleKackyQuickItem) {
		const msg = gameRychleKacky(generateRychleKacky(item.guessedNumbers), item.bet, item.drawCount);

		notificationStore.getState().setNotification(msg);
	}

	function allIn(item: IRychleKackyQuickItem) {
		updateState({
			item,
		});
	}

	function onSave(count: number, makeCalc: boolean) {
		const item = state.item;
		const msg = allInRychleKacky(count, item.guessedNumbers, item.bet, item.drawCount);

		notificationStore.getState().setNotification(msg);
		updateState({
			item: null,
		});
		makeCalc && completeAllGames();
	}

	return <div className="rychleKackyContainer">
		<GameTitle title="Rychlé kačky" img={getRychleKackyCover()} link={ROUTES.RYCHLE_KACKY} />
		<div className="rychleKackyContainer__quickItems">
			{ getRychleKackyQuickItems().map(item => <div key={item.id} className="rychleKackyContainer__quickItem">
				<h3 className="rychleKackyContainer__quickItemTitle">
					Rychlá sázka
				</h3>
				<span className="rychleKackyContainer__quickItemSeparator" />
				<p className="rychleKackyContainer__quickItemParagraph">
					<strong>{ item.guessedNumbers }</strong> čísel za <strong>{ formatPrice(item.bet) }</strong>
				</p>
				<p className="rychleKackyContainer__quickItemParagraph">
					<strong>{ item.drawCount }</strong> slosování
				</p>
				<MyButton className="rychleKackyContainer__quickItemBetBtn" text={`Vsadit za ${formatPrice(item.price)}`} onClick={() => addGame(item)}
					disabled={item.price > amount} />
				<MyButton className="rychleKackyContainer__quickItemBetBtn second" text="Vsadit vše" onClick={() => allIn(item)} />
			</div>) }
		</div>
		{ state.item && <AllInModal amount={amount} price={state.item.price} onSave={onSave} onClose={() => updateState({ item: null })} /> }
	</div>;
}
