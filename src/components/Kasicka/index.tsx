/* eslint-disable no-magic-numbers */
import MyButton from "~/my/MyButton";
import { formatPrice } from "~/utils/utils";
import { generateKasicka, gameKasicka, allInKasicka, getKasickaCover, getKasickaQuickItems } from "~/games/kasicka";
import { notificationStore } from "~/stores/notification";
import { ROUTES } from "~/const";
import GameTitle from "~/components/GameTitle";
import AllInModal from "~/components/AllInModal";
import { myUseState } from "~/hooks/myUseState";
import { IKasickaQuickItem } from "~/games/kasicka/interfaces";
import { completeAllGames } from "~/games/common";

import "./style.less";

interface IKasicka {
	amount: number;
}

interface IState {
	item: IKasickaQuickItem;
}

export default function Kasicka({
	amount,
}: IKasicka) {
	const { state, updateState } = myUseState<IState>({
		item: null,
	});

	function addGame(item: IKasickaQuickItem, generatedData?: ReturnType<typeof generateKasicka>) {
		const gameData = generatedData || generateKasicka(item.drawNumbers);
		const msg = gameKasicka(gameData, item.bet, item.betRatio);

		notificationStore.getState().setNotification(msg);
	}

	function allIn(item: IKasickaQuickItem) {
		updateState({
			item,
		});
	}

	function onSave(count: number, makeCalc: boolean) {
		const item = state.item;
		const msg = allInKasicka(count, item.drawNumbers, item.bet, item.betRatio);

		notificationStore.getState().setNotification(msg);
		updateState({
			item: null,
		});
		makeCalc && completeAllGames();
	}

	function createItem(item: IKasickaQuickItem, addGameCb: () => void, allInCb?: () => void) {
		return <div key={item.id} className="kasickaContainer__quickItem">
			<h3 className="kasickaContainer__quickItemTitle">
				{ item.title }
			</h3>
			<span className="kasickaContainer__quickItemSeparator" />
			<p className="kasickaContainer__quickItemParagraph">
				{ item.line1 }
			</p>
			<p className="kasickaContainer__quickItemParagraph">
				{ item.line2 }
			</p>
			<MyButton className="kasickaContainer__quickItemBetBtn" text={`Vsadit za ${formatPrice(item.price)}`} onClick={addGameCb}
				disabled={item.price > amount} />
			<MyButton className="kasickaContainer__quickItemBetBtn second" text="Vsadit vše" onClick={allInCb} />
		</div>;
	}

	return <div className="kasickaContainer">
		<GameTitle title="Kasička" img={getKasickaCover()} link={ROUTES.KASICKA} />
		<div className="kasickaContainer__quickItems">
			{ getKasickaQuickItems().map(item => createItem(item, () => addGame(item), () => allIn(item))) }
		</div>
		{ state.item && <AllInModal amount={amount} price={state.item.price} onSave={onSave} onClose={() => updateState({ item: null })} /> }
	</div>;
}
