import MyButton from "~/my/MyButton";
import { formatPrice } from "~/utils/utils";
import { generateSportkaGame, gameSportka, allInSportka, generateFavouriteTicket, getSportkaCover, getSportkaQuickItems } from "~/games/sportka";
import { notificationStore } from "~/stores/notification";
import { ROUTES } from "~/const";
import GameTitle from "~/components/GameTitle";
import AllInModal from "~/components/AllInModal";
import { myUseState } from "~/hooks/myUseState";
import { ISportQuickItem } from "~/games/sportka/interfaces";

import "./style.less";

interface ISportka {
	amount: number;
}

interface IState {
	item: ISportQuickItem;
}

export default function Sportka({
	amount,
}: ISportka) {
	const { state, updateState } = myUseState<IState>({
		item: null,
	});
	const quickItemsData = getSportkaQuickItems();

	function addGame(item: ISportQuickItem, generatedData?: ReturnType<typeof generateSportkaGame>) {
		const gameData = generatedData || generateSportkaGame(item.columns, item.chance);
		const msg = gameSportka(gameData.columns, gameData.chance);

		notificationStore.getState().setNotification(msg);
	}

	function allIn(item: ISportQuickItem) {
		updateState({
			item,
		});
	}

	function onSave(count: number) {
		const msg = allInSportka(count, state.item.columns, state.item.chance);

		notificationStore.getState().setNotification(msg);
		updateState({
			item: null,
		});
	}

	function createItem(item: ISportQuickItem, addGameCb: () => void, allInCb?: () => void, disable?: boolean) {
		return <div key={item.id} className="sportkaContainer__quickItem">
			<h3 className="sportkaContainer__quickItemTitle">
				{ item.title }
			</h3>
			<span className="sportkaContainer__quickItemSeparator" />
			<p className="sportkaContainer__quickItemParagraph">
				{ item.hasSuperJackpot && <strong>{ item.line1 }</strong> }
				{ !item.hasSuperJackpot && item.line1 }
			</p>
			<p className="sportkaContainer__quickItemParagraph">
				{ item.line2 }
			</p>
			<p className="sportkaContainer__quickItemParagraph">
				{ item.line3 }
			</p>
			<MyButton className="sportkaContainer__quickItemBetBtn" text={`Vsadit za ${formatPrice(item.price)}`} onClick={addGameCb}
				disabled={item.price > amount} />
			<MyButton className="sportkaContainer__quickItemBetBtn second" text="Vsadit vše" onClick={allInCb} disabled={disable} />
		</div>;
	}

	return <div className="sportkaContainer">
		<GameTitle title="Sportka" img={getSportkaCover()} link={ROUTES.SPORTKA} />
		<div className="sportkaContainer__quickItems">
			{ quickItemsData.items.map(item => createItem(item, () => addGame(item), () => allIn(item))) }
			{ createItem(quickItemsData.myNumbers, () => addGame(quickItemsData.myNumbers, generateFavouriteTicket()), undefined, true) }
		</div>
		{ state.item && <AllInModal amount={amount} price={state.item.price} onSave={onSave} onClose={() => updateState({ item: null })} /> }
	</div>;
}
