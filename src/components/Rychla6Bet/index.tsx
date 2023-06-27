import Modal from "~/components/Modal";
import NumberTable from "~/components/NumberTable";
import { RYCHLA6 } from "~/const";
import { gameRychla6 } from "~/providers/sazka";
import { generateRychla6, formatPrice, getClassName } from "~/utils/utils";
import ButtonLink from "~/components/ButtonLink";
import MyNumberWithSet from "~/my/MyNumberWithSet";
import { myUseState } from "~/hooks/myUseState";
import MyButton from "~/my/MyButton";
import { sazkaStore } from "~/stores/sazka";

import "./style.less";

interface IState {
	drawCount: number;
	bet: number;
	price: number;
	guessedNumbers: Array<number>;
}

interface IRychla6Bet {
	onClose?: () => void;
}

export default function Rychla6Bet({
	onClose = () => {},
}: IRychla6Bet) {
	const { sazka } = sazkaStore(sazkaState => ({
		sazka: sazkaState.sazka,
	}));
	const { state, updateState } = myUseState<IState>({
		drawCount: RYCHLA6.minDrawCount,
		bet: RYCHLA6.bets[0],
		price: RYCHLA6.minDrawCount * RYCHLA6.bets[0],
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
			price: state.bet * drawCount,
		});
	}

	function updateBet(bet: number) {
		updateState({
			bet,
			price: bet * state.drawCount,
		});
	}

	function makeBet() {
		gameRychla6(state.guessedNumbers, state.bet, state.drawCount);
		onClose();
	}

	return <Modal className="rychla6BetModal" onClose={onClose}>
		<h3 className="rychla6BetModal__title">
			Rychlá 6
		</h3>
		<div className="rychla6BetModal__tableHolder">
			<div className="rychla6BetModal__tableInner">
				<NumberTable min={RYCHLA6.min} max={RYCHLA6.max} perLine={RYCHLA6.perLine} selectCount={RYCHLA6.guessedNumbers} selected={state.guessedNumbers} onSelect={guessedNumbers => updateState({ guessedNumbers })} />
				<div className="rychla6BetModal__tableControls">
					<ButtonLink title="Smazat" onClick={() => updateState({ guessedNumbers: [] })} />
					<ButtonLink title="Náhodně" onClick={setRandomNumbers} />
				</div>
			</div>
		</div>
		<div className="rychla6BetModal__numberWithSetHolder">
			<MyNumberWithSet min={RYCHLA6.minDrawCount} text="Počet slosování" updatedValue={RYCHLA6.drawCountUpdatedValue} value={state.drawCount} onChange={updateDrawCount} />
		</div>
		<div className="rychla6BetModal__bets">
			{ RYCHLA6.bets.map(betItem => <MyButton text={formatPrice(betItem)} onClick={() => updateBet(betItem)} key={betItem} className={getClassName(["rychla6BetModal__betBtn", betItem === state.bet ? "active" : ""])} />) }
		</div>
		<div className="rychla6BetModal__numberWithSetHolder">
			<MyButton text={`Vsadit za ${formatPrice(state.price)}`} onClick={makeBet} disabled={state.price === 0 || state.guessedNumbers.length !== RYCHLA6.guessedNumbers || state.price > sazka.amount} />
		</div>
	</Modal>;
}
