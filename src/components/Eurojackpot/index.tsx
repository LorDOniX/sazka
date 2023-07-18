import MyButton from "~/my/MyButton";
import { formatPrice } from "~/utils/utils";
import { generateEurojackpotGame, gameEurojackpot, allInEurojackpot, getEurojackpotCover, getEurojackpotQuickItems } from "~/games/eurojackpot";
import { notificationStore } from "~/stores/notification";
import { ROUTES } from "~/const";
import GameTitle from "~/components/GameTitle";
import AllInModal from "~/components/AllInModal";
import { myUseState } from "~/hooks/myUseState";
import { IEurojackpotQuickItem } from "~/games/eurojackpot/interfaces";

import "./style.less";

interface IEurojackpot {
	amount: number;
}

interface IState {
	item: IEurojackpotQuickItem;
}

export default function Eurojackpot({
	amount,
}: IEurojackpot) {
	const { state, updateState } = myUseState<IState>({
		item: null,
	});

	function addGame(item: IEurojackpotQuickItem, generatedData?: ReturnType<typeof generateEurojackpotGame>) {
		const gameData = generatedData || generateEurojackpotGame(item.columns, item.chance);
		const msg = gameEurojackpot(gameData.columns, gameData.chance);

		notificationStore.getState().setNotification(msg);
	}

	function allIn(item: IEurojackpotQuickItem) {
		updateState({
			item,
		});
	}

	function onSave(count: number) {
		const msg = allInEurojackpot(count, state.item.columns, state.item.chance);

		notificationStore.getState().setNotification(msg);
		updateState({
			item: null,
		});
	}

	function createItem(item: IEurojackpotQuickItem, addGameCb: () => void, allInCb?: () => void) {
		return <div key={item.id} className="eurojackpotContainer__quickItem">
			<h3 className="eurojackpotContainer__quickItemTitle">
				{ item.title }
			</h3>
			<span className="eurojackpotContainer__quickItemSeparator" />
			<p className="eurojackpotContainer__quickItemParagraph">
				{ item.line1 }
			</p>
			<p className="eurojackpotContainer__quickItemParagraph">
				{ item.line2 }
			</p>
			<p className="eurojackpotContainer__quickItemParagraph">
				{ item.line3 }
			</p>
			<MyButton className="eurojackpotContainer__quickItemBetBtn" text={`Vsadit za ${formatPrice(item.price)}`} onClick={addGameCb}
				disabled={item.price > amount} />
			<MyButton className="eurojackpotContainer__quickItemBetBtn second" text="Vsadit vše" onClick={allInCb} />
		</div>;
	}

	return <div className="eurojackpotContainer">
		<GameTitle title="Eurojackpot" img={getEurojackpotCover()} link={ROUTES.EUROJACKPOT} />
		<div className="eurojackpotContainer__quickItems">
			{ getEurojackpotQuickItems().map(item => createItem(item, () => addGame(item), () => allIn(item))) }
		</div>
		{ state.item && <AllInModal amount={amount} price={state.item.price} onSave={onSave} onClose={() => updateState({ item: null })} /> }
	</div>;
}
