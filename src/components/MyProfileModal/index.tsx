import Modal from "~/components/Modal";
import MyInputNumber from "~/my/MyInputNumber";
import MyButton from "~/my/MyButton";
import { myUseState } from "~/hooks/myUseState";
import { DEFAULT_INSERT_AMOUNT, BUTTONS_AMOUNTS } from "~/const";
import { sazkaStore } from "~/stores/sazka";
import { formatPrice } from "~/utils/utils";
import { notificationStore } from "~/stores/notification";

import "./style.less";

interface IState {
	amount: number;
}

interface IMyProfileModal {
	onClose?: () => void;
}

export default function MyProfileModal({
	onClose = () => {},
}: IMyProfileModal) {
	const { sazka, addAmount, clear, clearBets } = sazkaStore(sazkaState => ({
		sazka: sazkaState.sazka,
		addAmount: sazkaState.addAmount,
		clear: sazkaState.clear,
		clearBets: sazkaState.clearBets,
	}));
	const { state, updateState } = myUseState<IState>({
		amount: DEFAULT_INSERT_AMOUNT,
	});
	const diff = sazka.allPrices - sazka.allBets;

	function addAmountToStore(amount: number) {
		addAmount(amount);
		notificationStore.getState().setNotification(`Vloženo ${amount} Kč na účet`);
		onClose();
	}

	function clickAddAmount() {
		addAmountToStore(state.amount);
	}

	return <Modal className="myProfileModal" onClose={onClose} topPosition={true}>
		<h2 className="myProfileModal__title mainTitle">
			Profil
		</h2>
		<div className="myProfileModal__info">
			<div className="myProfileModal__infoLine">
				<span className="myProfileModal__infoTitle">
					Celkem vloženo:
				</span>
				<strong className="myProfileModal__infoPrice" data-negative={sazka.allAmount > 0 ? "yes" : "no"}>
					{ formatPrice(sazka.allAmount) }
				</strong>
			</div>
			<div className="myProfileModal__infoLine">
				<span className="myProfileModal__infoTitle">
					Celkem prosázeno:
				</span>
				<strong className="myProfileModal__infoPrice">
					{ formatPrice(sazka.allBets) }
				</strong>
			</div>
			<div className="myProfileModal__infoLine">
				<span className="myProfileModal__infoTitle">
					Celkem vyhráno:
				</span>
				<strong className="myProfileModal__infoPrice">
					{ formatPrice(sazka.allPrices) }
				</strong>
			</div>
			<div className="myProfileModal__infoLine">
				<span className="myProfileModal__infoTitle">
					Rozdíl:
				</span>
				<strong className="myProfileModal__infoPrice" data-negative={diff < 0 ? "yes" : "no"}>
					{ formatPrice(diff) }
				</strong>
			</div>
		</div>
		<h3 className="myProfileModal__title">
			Vložit částku
		</h3>
		<div className="myProfileModal__insertAmountButtons">
			{ BUTTONS_AMOUNTS.map(amount => <MyButton text={`Vložit ${formatPrice(amount)}`} onClick={() => addAmountToStore(amount)} key={amount} />) }
		</div>
		<div className="myProfileModal__insertAmount">
			<MyInputNumber value={state.amount} onChange={amount => updateState({ amount })} onEnter={() => clickAddAmount()} />
			<MyButton text="Vložit" onClick={clickAddAmount} />
		</div>
		<div className="myProfileModal__controlButtons">
			<MyButton text="Reset" onClick={() => clear()} />
			<MyButton text="Smazat sázky" onClick={() => clearBets()} />
		</div>
	</Modal>;
}
