import Modal from "~/components/Modal";
import NumberTable from "~/components/NumberTable";
import { KORUNKA_NA3 } from "~/games/korunka-na3/const";
import { formatPrice } from "~/utils/utils";
import ButtonLink from "~/components/ButtonLink";
import MyNumberWithSet from "~/my/MyNumberWithSet";
import MySelector from "~/my/MySelector";
import { myUseState } from "~/hooks/myUseState";
import MyButton from "~/my/MyButton";
import { sazkaStore } from "~/stores/sazka";
import { generateKorunkaNa3, gameKorunkaNa3 } from "~/games/korunka-na3";

import "./style.less";

interface IState {
	drawCount: number;
	bet: number;
	guessedNumbers: Array<number>;
}

interface IKorunkaNa3Bet {
	onClose?: () => void;
}

export default function KorunkaNa3Bet({
	onClose = () => {},
}: IKorunkaNa3Bet) {
	const { sazka } = sazkaStore(sazkaState => ({
		sazka: sazkaState.sazka,
	}));
	const { state, updateState } = myUseState<IState>({
		drawCount: KORUNKA_NA3.minDrawCount,
		bet: KORUNKA_NA3.bets[0],
		guessedNumbers: generateKorunkaNa3(),
	});

	function setRandomNumbers() {
		const randomNumbers = generateKorunkaNa3();

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
		gameKorunkaNa3(state.guessedNumbers, state.bet, state.drawCount);
		onClose();
	}

	function getPrice() {
		return state.bet * state.drawCount;
	}

	function isDisabled() {
		const price = getPrice();

		return price === 0 || state.guessedNumbers.length !== KORUNKA_NA3.guessedNumbers || price > sazka.amount;
	}

	return <Modal className="korunkaNa3BetModal" onClose={onClose}>
		<h3 className="korunkaNa3BetModal__title">
			Korunka na 3
		</h3>
		<div className="korunkaNa3BetModal__tableHolder">
			<div className="korunkaNa3BetModal__tableInner">
				<NumberTable min={KORUNKA_NA3.min} max={KORUNKA_NA3.max} perLine={KORUNKA_NA3.perLine} selectCount={KORUNKA_NA3.guessedNumbers} selected={state.guessedNumbers} onSelect={guessedNumbers => updateState({ guessedNumbers })} />
				<div className="korunkaNa3BetModal__tableControls">
					<ButtonLink title="Smazat" onClick={() => updateState({ guessedNumbers: [] })} />
					<ButtonLink title="Náhodně" onClick={setRandomNumbers} />
				</div>
			</div>
		</div>
		<div className="korunkaNa3BetModal__numberWithSetHolder">
			<MyNumberWithSet min={KORUNKA_NA3.minDrawCount} text="Počet slosování" updatedValue={KORUNKA_NA3.drawCountUpdatedValue} value={state.drawCount} onChange={updateDrawCount} />
		</div>
		<MySelector className="korunkaNa3BetModal__priceSelector" values={KORUNKA_NA3.bets} value={state.bet} format={value => formatPrice(value as number)} onUpdate={(bet: number) => updateState({ bet })} />
		<div className="korunkaNa3BetModal__numberWithSetHolder">
			<MyButton text={`Vsadit za ${formatPrice(getPrice())}`} onClick={makeBet} disabled={isDisabled()} />
		</div>
	</Modal>;
}
