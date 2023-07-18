import MyButton from "~/my/MyButton";
import { formatPrice } from "~/utils/utils";
import { generateStastnych10Game, gameStastnych10, allInStastnych10, getStastnych10Cover, getStastnych10QuickItems } from "~/games/stastnych10";
import { notificationStore } from "~/stores/notification";
import { ROUTES } from "~/const";
import GameTitle from "~/components/GameTitle";
import AllInModal from "~/components/AllInModal";
import { myUseState } from "~/hooks/myUseState";
import { IStastnych10QuickItem } from "~/games/stastnych10/interfaces";

import "./style.less";

interface IStastnych10 {
	amount: number;
}

interface IState {
	item: IStastnych10QuickItem;
}

export default function Stastnych10({
	amount,
}: IStastnych10) {
	const { state, updateState } = myUseState<IState>({
		item: null,
	});

	function addGame(item: IStastnych10QuickItem) {
		const gameData = generateStastnych10Game(item.count, item.bet, item.kingGame, item.columns, item.chance);
		const msg = gameStastnych10(gameData.columns, gameData.chance);

		notificationStore.getState().setNotification(msg);
	}

	function allIn(item: IStastnych10QuickItem) {
		updateState({
			item,
		});
	}

	function onSave(count: number) {
		const item = state.item;
		const gameData = generateStastnych10Game(item.count, item.bet, item.kingGame, item.columns, item.chance);
		const msg = allInStastnych10(count, item.count, item.bet, item.kingGame, gameData.columns, item.chance);

		notificationStore.getState().setNotification(msg);
		updateState({
			item: null,
		});
	}

	function createItem(item: IStastnych10QuickItem, addGameCb: () => void, allInCb?: () => void) {
		return <div key={item.id} className="stastnych10Container__quickItem">
			<div className="stastnych10Container__quickItemTopPart">
				<h3 className="stastnych10Container__quickItemTitle">
					{ item.title }
				</h3>
				<span className="stastnych10Container__quickItemSeparator" />
			</div>
			<div className="stastnych10Container__quickItemMiddlePart">
				<p className="stastnych10Container__quickItemParagraph">
					{ item.line1 }
				</p>
				<p className="stastnych10Container__quickItemParagraph">
					{ item.line2 }
				</p>
			</div>
			<div className="stastnych10Container__quickItemBottomPart">
				<MyButton className="stastnych10Container__quickItemBetBtn" text={`Vsadit za ${formatPrice(item.price)}`} onClick={addGameCb}
					disabled={item.price > amount} />
				<MyButton className="stastnych10Container__quickItemBetBtn second" text="Vsadit vše" onClick={allInCb} />
			</div>
		</div>;
	}

	return <div className="stastnych10Container">
		<GameTitle title="Šťastných 10" img={getStastnych10Cover()} link={ROUTES.STASTNYCH10} />
		<div className="stastnych10Container__quickItems">
			{ getStastnych10QuickItems().map(item => createItem(item, () => addGame(item), () => allIn(item))) }
		</div>
		{ state.item && <AllInModal amount={amount} price={state.item.price} onSave={onSave} onClose={() => updateState({ item: null })} /> }
	</div>;
}
