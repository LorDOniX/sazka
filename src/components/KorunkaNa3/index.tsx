import MyButton from "~/my/MyButton";
import { formatPrice } from "~/utils/utils";
import { notificationStore } from "~/stores/notification";
import { generateKorunkaNa3, gameKorunkaNa3, allInRychlaKorunkaNa3, getKorunkaNa3Cover, getKorunkaNa3QuickItems } from "~/games/korunka-na3";
import { ROUTES } from "~/const";
import GameTitle from "~/components/GameTitle";
import AllInModal from "~/components/AllInModal";
import { myUseState } from "~/hooks/myUseState";
import { IKorunkaNa3QuickItem } from "~/games/korunka-na3/interfaces";

import "./style.less";

interface IKorunkaNa3 {
	amount: number;
}

interface IState {
	item: IKorunkaNa3QuickItem;
}

export default function KorunkaNa3({
	amount,
}: IKorunkaNa3) {
	const { state, updateState } = myUseState<IState>({
		item: null,
	});

	function addGame(item: IKorunkaNa3QuickItem) {
		const msg = gameKorunkaNa3(generateKorunkaNa3(), item.bet, item.drawCount);

		notificationStore.getState().setNotification(msg);
	}

	function allIn(item: IKorunkaNa3QuickItem) {
		updateState({
			item,
		});
	}

	function onSave(count: number) {
		const item = state.item;
		const msg = allInRychlaKorunkaNa3(count, item.bet, item.drawCount);

		notificationStore.getState().setNotification(msg);
		updateState({
			item: null,
		});
	}

	return <div className="korunkaNa3Container">
		<GameTitle title="Korunka na 3" img={getKorunkaNa3Cover()} link={ROUTES.KORUNKA_NA3} />
		<div className="korunkaNa3Container__quickItems">
			{ getKorunkaNa3QuickItems().map(item => <div key={item.id} className="korunkaNa3Container__quickItem">
				<h3 className="korunkaNa3Container__quickItemTitle">
					{ item.title }
				</h3>
				<span className="korunkaNa3Container__quickItemSeparator" />
				<p className="korunkaNa3Container__quickItemParagraph">
					Hlavní hra za <strong>{ formatPrice(item.price) }</strong>
				</p>
				<p className="korunkaNa3Container__quickItemParagraph">
					Na <strong>{ item.drawCount }</strong> slosování
				</p>
				<MyButton className="korunkaNa3Container__quickItemBetBtn" text={`Vsadit za ${formatPrice(item.price)}`} onClick={() => addGame(item)}
					disabled={item.price > amount} />
				<MyButton className="korunkaNa3Container__quickItemBetBtn second" text="Vsadit vše" onClick={() => allIn(item)} />
			</div>) }
		</div>
		{ state.item && <AllInModal amount={amount} price={state.item.price} onSave={onSave} onClose={() => updateState({ item: null })} /> }
	</div>;
}
