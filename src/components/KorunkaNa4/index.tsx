import MyButton from "~/my/MyButton";
import { formatPrice } from "~/utils/utils";
import { notificationStore } from "~/stores/notification";
import { generateKorunkaNa4, gameKorunkaNa4, allInRychlaKorunkaNa4, getKorunkaNa4Cover, getKorunkaNa4QuickItems } from "~/games/korunka-na4";
import { ROUTES } from "~/const";
import GameTitle from "~/components/GameTitle";
import AllInModal from "~/components/AllInModal";
import { myUseState } from "~/hooks/myUseState";
import { IKorunkaNa4QuickItem } from "~/games/korunka-na4/interfaces";

import "./style.less";

interface IKorunkaNa4 {
	amount: number;
}

interface IState {
	item: IKorunkaNa4QuickItem;
}

export default function KorunkaNa4({
	amount,
}: IKorunkaNa4) {
	const { state, updateState } = myUseState<IState>({
		item: null,
	});

	function addGame(item: IKorunkaNa4QuickItem) {
		const msg = gameKorunkaNa4(generateKorunkaNa4(), item.bet, item.drawCount);

		notificationStore.getState().setNotification(msg);
	}

	function allIn(item: IKorunkaNa4QuickItem) {
		updateState({
			item,
		});
	}

	function onSave(count: number) {
		const item = state.item;
		const msg = allInRychlaKorunkaNa4(count, item.bet, item.drawCount);

		notificationStore.getState().setNotification(msg);
		updateState({
			item: null,
		});
	}

	return <div className="korunkaNa4Container">
		<GameTitle title="Korunka na 4" img={getKorunkaNa4Cover()} link={ROUTES.KORUNKA_NA4} />
		<div className="korunkaNa4Container__quickItems">
			{ getKorunkaNa4QuickItems().map(item => <div key={item.id} className="korunkaNa4Container__quickItem">
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
				<MyButton className="korunkaNa4Container__quickItemBetBtn second" text="Vsadit vše" onClick={() => allIn(item)} />
			</div>) }
		</div>
		{ state.item && <AllInModal amount={amount} price={state.item.price} onSave={onSave} onClose={() => updateState({ item: null })} /> }
	</div>;
}
