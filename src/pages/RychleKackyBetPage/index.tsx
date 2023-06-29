import { useNavigate } from "react-router-dom";

import Page from "~/components/Page";
import NumberTable from "~/components/NumberTable";
import { RYCHLE_KACKY } from "~/games/rychle-kacky/const";
import { formatPrice } from "~/utils/utils";
import { generateRychleKacky, gameRychleKacky } from "~/games/rychle-kacky";
import ButtonLink from "~/components/ButtonLink";
import MyNumberWithSet from "~/my/MyNumberWithSet";
import { myUseState } from "~/hooks/myUseState";
import MyButton from "~/my/MyButton";
import { sazkaStore } from "~/stores/sazka";
import { ROUTES } from "~/const";
import GoBack from "~/components/GoBack";
import { notificationStore } from "~/stores/notification";

import "./style.less";

interface IState {
	drawCount: number;
	bet: number;
	price: number;
	guessedNumbers: Array<number>;
}

export default function RychleKackyBetPage() {
	const navigate = useNavigate();
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
		const msg = gameRychleKacky(state.guessedNumbers, state.bet, state.drawCount);

		notificationStore.getState().setNotification(msg);
		navigate(ROUTES.QUICK);
	}

	return <Page>
		<h3 className="rychleKackyBetPage__title">
			Rychlé kačky
			<GoBack url={ROUTES.QUICK} />
		</h3>
		<div className="rychleKackyBetPage__tableHolder">
			<div className="rychleKackyBetPage__tableInner">
				<NumberTable min={RYCHLE_KACKY.min} max={RYCHLE_KACKY.max} perLine={RYCHLE_KACKY.perLine} selectCount={RYCHLE_KACKY.guessedNumbersMax} selected={state.guessedNumbers} onSelect={guessedNumbers => updateState({ guessedNumbers })} />
				<div className="rychleKackyBetPage__tableControls">
					<ButtonLink title="Smazat" onClick={() => updateState({ guessedNumbers: [] })} />
					<ButtonLink title="Náhodně" onClick={setRandomNumbers} />
				</div>
			</div>
		</div>
		<div className="rychleKackyBetPage__numberWithSetHolder">
			<MyNumberWithSet min={RYCHLE_KACKY.minDrawCount} text="Počet slosování" updatedValue={RYCHLE_KACKY.drawCountUpdatedValue} value={state.drawCount} onChange={updateDrawCount} />
		</div>
		<div className="rychleKackyBetPage__numberWithSetHolder">
			<MyNumberWithSet min={0} text="Sázka" updatedValue={RYCHLE_KACKY.betUpdatedValue} value={state.bet} onChange={updateBet} />
		</div>
		<div className="rychleKackyBetPage__numberWithSetHolder">
			<MyButton text={`Vsadit za ${formatPrice(state.price)}`} onClick={makeBet} disabled={state.price === 0 || state.guessedNumbers.length !== RYCHLE_KACKY.guessedNumbersMax || state.price > sazka.amount} />
		</div>
	</Page>;
}
