import { useNavigate } from "react-router-dom";

import NumberTable from "~/components/NumberTable";
import { KORUNKA_NA4 } from "~/games/korunka-na4/const";
import { formatPrice, generateNumbersInRange } from "~/utils/utils";
import ButtonLink from "~/components/ButtonLink";
import MySelector from "~/my/MySelector";
import { myUseState } from "~/hooks/myUseState";
import MyButton from "~/my/MyButton";
import { sazkaStore } from "~/stores/sazka";
import { generateKorunkaNa4, gameKorunkaNa4 } from "~/games/korunka-na4";
import Page from "~/components/Page";
import { ROUTES } from "~/const";
import GoBack from "~/components/GoBack";
import { notificationStore } from "~/stores/notification";

import "./style.less";

interface IState {
	drawCount: number;
	bet: number;
	guessedNumbers: Array<number>;
}

export default function KorunkaNa4BetPage() {
	const navigate = useNavigate();
	const { sazka } = sazkaStore(sazkaState => ({
		sazka: sazkaState.sazka,
	}));
	const { state, updateState } = myUseState<IState>({
		drawCount: KORUNKA_NA4.minDrawCount,
		bet: KORUNKA_NA4.bets[0],
		guessedNumbers: generateKorunkaNa4(),
	});

	function setRandomNumbers() {
		const randomNumbers = generateKorunkaNa4();

		updateState({
			guessedNumbers: randomNumbers,
		});
	}

	function updateDrawCount(drawCount: number) {
		updateState({
			drawCount,
		});
	}

	function makeBet() {
		const msg = gameKorunkaNa4(state.guessedNumbers, state.bet, state.drawCount);

		notificationStore.getState().setNotification(msg);
		navigate(ROUTES.QUICK);
	}

	function getPrice() {
		return state.bet * state.drawCount;
	}

	function isDisabled() {
		const price = getPrice();

		return price === 0 || state.guessedNumbers.length !== KORUNKA_NA4.guessedNumbers || price > sazka.amount;
	}

	return <Page>
		<h3 className="korunkaNa4BetPage__title">
			Korunka na 4
			<GoBack url={ROUTES.QUICK} />
		</h3>
		<div className="korunkaNa4BetPage__tableHolder">
			<div className="korunkaNa4BetPage__tableInner">
				<NumberTable min={KORUNKA_NA4.min} max={KORUNKA_NA4.max} perLine={KORUNKA_NA4.perLine} selectCount={KORUNKA_NA4.guessedNumbers} selected={state.guessedNumbers} onSelect={guessedNumbers => updateState({ guessedNumbers })} />
				<div className="korunkaNa4BetPage__tableControls">
					<ButtonLink title="Smazat" onClick={() => updateState({ guessedNumbers: [] })} />
					<ButtonLink title="Náhodně" onClick={setRandomNumbers} />
				</div>
			</div>
		</div>
		<h4>Vyberte počet slosování</h4>
		<div className="korunkaNa4BetPage__drawCount">
			<MySelector values={generateNumbersInRange(KORUNKA_NA4.minDrawCount, KORUNKA_NA4.maxDrawCount)} value={state.drawCount} onChange={updateDrawCount} />
		</div>
		<h4>Kolik chcete vsadit?</h4>
		<MySelector className="korunkaNa4BetPage__priceSelector" values={KORUNKA_NA4.bets} value={state.bet} format={value => formatPrice(value as number)} onChange={(bet: number) => updateState({ bet })} />
		<div className="korunkaNa4BetPage__numberWithSetHolder">
			<MyButton text={`Vsadit za ${formatPrice(getPrice())}`} onClick={makeBet} disabled={isDisabled()} />
		</div>
	</Page>;
}
