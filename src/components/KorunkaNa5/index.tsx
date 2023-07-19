import MyButton from "~/my/MyButton";
import { formatPrice } from "~/utils/utils";
import { notificationStore } from "~/stores/notification";
import { generateKorunkaNa5, gameKorunkaNa5, allInRychlaKorunkaNa5, getKorunkaNa5Cover, getKorunkaNa5QuickItems } from "~/games/korunka-na5";
import { ROUTES } from "~/const";
import GameTitle from "~/components/GameTitle";
import AllInModal from "~/components/AllInModal";
import { myUseState } from "~/hooks/myUseState";
import { IKorunkaNa5QuickItem } from "~/games/korunka-na5/interfaces";
import { completeAllGames } from "~/games/common";

import "./style.less";

interface IKorunkaNa5 {
	amount: number;
}

interface IState {
	item: IKorunkaNa5QuickItem;
}

export default function KorunkaNa5({
	amount,
}: IKorunkaNa5) {
	const { state, updateState } = myUseState<IState>({
		item: null,
	});

	function addGame(item: IKorunkaNa5QuickItem) {
		const msg = gameKorunkaNa5(generateKorunkaNa5(), item.bet, item.drawCount);

		notificationStore.getState().setNotification(msg);
	}

	function allIn(item: IKorunkaNa5QuickItem) {
		updateState({
			item,
		});
	}

	function onSave(count: number, makeCalc: boolean) {
		const item = state.item;
		const msg = allInRychlaKorunkaNa5(count, item.bet, item.drawCount);

		notificationStore.getState().setNotification(msg);
		updateState({
			item: null,
		});
		makeCalc && completeAllGames();
	}

	return <div className="korunkaNa5Container">
		<GameTitle title="Korunka na 5" img={getKorunkaNa5Cover()} link={ROUTES.KORUNKA_NA5} />
		<div className="korunkaNa5Container__quickItems">
			{ getKorunkaNa5QuickItems().map(item => <div key={item.id} className="korunkaNa5Container__quickItem">
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
				<MyButton className="korunkaNa5Container__quickItemBetBtn second" text="Vsadit vše" onClick={() => allIn(item)} />
			</div>) }
		</div>
		{ state.item && <AllInModal amount={amount} price={state.item.price} onSave={onSave} onClose={() => updateState({ item: null })} /> }
	</div>;
}
