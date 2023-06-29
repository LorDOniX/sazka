import Page from "~/components/Page";
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

export default function MyProfilePage() {
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
	}

	function clickAddAmount() {
		addAmountToStore(state.amount);
	}

	return <Page>
		<h2 className="myProfilePage__title mainTitle">
			Profil
		</h2>
		<div className="myProfilePage__info">
			<div className="myProfilePage__infoLine">
				<span className="myProfilePage__infoTitle">
					Celkem vloženo:
				</span>
				<strong className="myProfilePage__infoPrice" data-negative={sazka.allAmount > 0 ? "yes" : "no"}>
					{ formatPrice(sazka.allAmount) }
				</strong>
			</div>
			<div className="myProfilePage__infoLine">
				<span className="myProfilePage__infoTitle">
					Celkem prosázeno:
				</span>
				<strong className="myProfilePage__infoPrice">
					{ formatPrice(sazka.allBets) }
				</strong>
			</div>
			<div className="myProfilePage__infoLine">
				<span className="myProfilePage__infoTitle">
					Celkem vyhráno:
				</span>
				<strong className="myProfilePage__infoPrice">
					{ formatPrice(sazka.allPrices) }
				</strong>
			</div>
			<div className="myProfilePage__infoLine">
				<span className="myProfilePage__infoTitle">
					Rozdíl:
				</span>
				<strong className="myProfilePage__infoPrice" data-negative={diff < 0 ? "yes" : "no"}>
					{ formatPrice(diff) }
				</strong>
			</div>
		</div>
		<h3 className="myProfilePage__title">
			Vložit částku
		</h3>
		<div className="myProfilePage__insertAmountButtons">
			{ BUTTONS_AMOUNTS.map(amount => <MyButton text={`Vložit ${formatPrice(amount)}`} onClick={() => addAmountToStore(amount)} key={amount} />) }
		</div>
		<div className="myProfilePage__insertAmount">
			<MyInputNumber value={state.amount} onChange={amount => updateState({ amount })} onEnter={() => clickAddAmount()} />
			<MyButton text="Vložit" onClick={clickAddAmount} />
		</div>
		<div className="myProfilePage__controlButtons">
			<MyButton text="Reset" onClick={() => clear()} />
			<MyButton text="Smazat sázky" onClick={() => clearBets()} />
		</div>
	</Page>;
}
