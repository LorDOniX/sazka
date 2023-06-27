import Modal from "~/components/Modal";
import NumberTable from "~/components/NumberTable";
import { RYCHLE_KACKY } from "~/const";
import { gameRychleKacky } from "~/providers/sazka";
import { generateRychleKacky, formatPrice } from "~/utils/utils";
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

interface IRychleKackyBet {
	onClose?: () => void;
}

export default function RychleKackyBet({
	onClose = () => {},
}: IRychleKackyBet) {
	const { sazka } = sazkaStore(sazkaState => ({
		sazka: sazkaState.sazka,
	}));
	const { state, updateState } = myUseState<IState>({
		drawCount: RYCHLE_KACKY.minDrawCount,
		bet: RYCHLE_KACKY.defaultBet,
		price: RYCHLE_KACKY.minDrawCount * RYCHLE_KACKY.defaultBet,
		guessedNumbers: generateRychleKacky(RYCHLE_KACKY.guessedNumbersMax),
	});

	function setRandomNumbers() {
		const randomNumbers = generateRychleKacky(RYCHLE_KACKY.guessedNumbersMax);

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
		gameRychleKacky(state.guessedNumbers, state.bet, state.drawCount);
		onClose();
	}

	return <Modal className="rychleKackyBetModal" onClose={onClose}>
		<h3 className="rychleKackyBetModal__title">
			Rychlé kačky
		</h3>
		<div className="rychleKackyBetModal__tableHolder">
			<div className="rychleKackyBetModal__tableInner">
				<NumberTable min={RYCHLE_KACKY.min} max={RYCHLE_KACKY.max} perLine={RYCHLE_KACKY.perLine} selectCount={RYCHLE_KACKY.guessedNumbersMax} selected={state.guessedNumbers} onSelect={guessedNumbers => updateState({ guessedNumbers })} />
				<div className="rychleKackyBetModal__tableControls">
					<ButtonLink title="Smazat" onClick={() => updateState({ guessedNumbers: [] })} />
					<ButtonLink title="Náhodně" onClick={setRandomNumbers} />
				</div>
			</div>
		</div>
		<div className="rychleKackyBetModal__numberWithSetHolder">
			<MyNumberWithSet min={RYCHLE_KACKY.minDrawCount} text="Počet slosování" updatedValue={RYCHLE_KACKY.drawCountUpdatedValue} value={state.drawCount} onChange={updateDrawCount} />
		</div>
		<div className="rychleKackyBetModal__numberWithSetHolder">
			<MyNumberWithSet min={0} text="Sázka" updatedValue={RYCHLE_KACKY.betUpdatedValue} value={state.bet} onChange={updateBet} />
		</div>
		<div className="rychleKackyBetModal__numberWithSetHolder">
			<MyButton text={`Vsadit za ${formatPrice(state.price)}`} onClick={makeBet} disabled={state.price === 0 || state.guessedNumbers.length !== RYCHLE_KACKY.guessedNumbersMax || state.price > sazka.amount} />
		</div>
	</Modal>;
}
