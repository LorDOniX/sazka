import MyButton from "~/my/MyButton";
import { formatPrice } from "~/utils/utils";
import { generateRychla6, gameRychla6, allInRychla6, getRychla6Cover, getRychla6QuickItems } from "~/games/rychla6";
import { notificationStore } from "~/stores/notification";
import { ROUTES } from "~/const";
import GameTitle from "~/components/GameTitle";
import AllInModal from "~/components/AllInModal";
import { myUseState } from "~/hooks/myUseState";
import { IRychla6QuickItem } from "~/games/rychla6/interfaces";
import { completeAllGames } from "~/games/common";

import "./style.less";

interface IRychla6 {
	amount: number;
}

interface IState {
	item: IRychla6QuickItem;
}

export default function Rychla6({
	amount,
}: IRychla6) {
	const { state, updateState } = myUseState<IState>({
		item: null,
	});

	function addGame(item: IRychla6QuickItem) {
		const msg = gameRychla6(generateRychla6(), item.bet, item.drawCount);

		notificationStore.getState().setNotification(msg);
	}

	function allIn(item: IRychla6QuickItem) {
		updateState({
			item,
		});
	}

	function onSave(count: number, makeCalc: boolean) {
		const item = state.item;
		const msg = allInRychla6(count, item.bet, item.drawCount);

		notificationStore.getState().setNotification(msg);
		updateState({
			item: null,
		});
		makeCalc && completeAllGames();
	}

	return <div className="rychla6Container">
		<GameTitle title="Rychlá 6" img={getRychla6Cover()} link={ROUTES.RYCHLA6} />
		<div className="rychla6Container__quickItems">
			{ getRychla6QuickItems().map(item => <div key={item.id} className="rychla6Container__quickItem">
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
				<MyButton className="rychla6Container__quickItemBetBtn second" text="Vsadit vše" onClick={() => allIn(item)} />
			</div>) }
		</div>
		{ state.item && <AllInModal amount={amount} price={state.item.price} onSave={onSave} onClose={() => updateState({ item: null })} /> }
	</div>;
}
