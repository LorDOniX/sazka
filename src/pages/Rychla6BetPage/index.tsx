import { useNavigate } from "react-router-dom";

import Page from "~/components/Page";
import { ROUTES } from "~/const";
import NumberTable from "~/components/NumberTable";
import { RYCHLA6 } from "~/games/rychla6/const";
import { formatPrice } from "~/utils/utils";
import { generateRychla6, gameRychla6 } from "~/games/rychla6";
import ButtonLink from "~/components/ButtonLink";
import MyNumberWithSet from "~/my/MyNumberWithSet";
import MySelector from "~/my/MySelector";
import { myUseState } from "~/hooks/myUseState";
import MyButton from "~/my/MyButton";
import GoBack from "~/components/GoBack";
import { sazkaStore } from "~/stores/sazka";
import { notificationStore } from "~/stores/notification";

import "./style.less";

interface IState {
	drawCount: number;
	bet: number;
	guessedNumbers: Array<number>;
}

export default function Rychla6BetPage() {
	const navigate = useNavigate();
	const { sazka } = sazkaStore(sazkaState => ({
		sazka: sazkaState.sazka,
	}));
	const { state, updateState } = myUseState<IState>({
		drawCount: RYCHLA6.minDrawCount,
		bet: RYCHLA6.bets[0],
		guessedNumbers: generateRychla6(),
	});

	function setRandomNumbers() {
		const randomNumbers = generateRychla6();

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
		const msg = gameRychla6(state.guessedNumbers, state.bet, state.drawCount);

		notificationStore.getState().setNotification(msg);
		navigate(ROUTES.QUICK);
	}

	function getPrice() {
		return state.bet * state.drawCount;
	}

	function isDisabled() {
		const price = getPrice();

		return price === 0 || state.guessedNumbers.length !== RYCHLA6.guessedNumbers || price > sazka.amount;
	}

	return <Page>
		<h3 className="rychla6BetPage__title">
			Rychlá 6
			<GoBack url={ROUTES.QUICK} />
		</h3>
		<div className="rychla6BetPage__tableHolder">
			<div className="rychla6BetPage__tableInner">
				<NumberTable min={RYCHLA6.min} max={RYCHLA6.max} perLine={RYCHLA6.perLine} selectCount={RYCHLA6.guessedNumbers} selected={state.guessedNumbers} onSelect={guessedNumbers => updateState({ guessedNumbers })} />
				<div className="rychla6BetPage__tableControls">
					<ButtonLink title="Smazat" onClick={() => updateState({ guessedNumbers: [] })} />
					<ButtonLink title="Náhodně" onClick={setRandomNumbers} />
				</div>
			</div>
		</div>
		<div className="rychla6BetPage__numberWithSetHolder">
			<MyNumberWithSet min={RYCHLA6.minDrawCount} text="Počet slosování" updatedValue={RYCHLA6.drawCountUpdatedValue} value={state.drawCount} onChange={updateDrawCount} />
		</div>
		<MySelector className="rychla6BetPage__priceSelector" values={RYCHLA6.bets} value={state.bet} format={value => formatPrice(value as number)} onUpdate={(bet: number) => updateState({ bet })} />
		<div className="rychla6BetPage__numberWithSetHolder">
			<MyButton text={`Vsadit za ${formatPrice(getPrice())}`} onClick={makeBet} disabled={isDisabled()} />
		</div>
	</Page>;
}
