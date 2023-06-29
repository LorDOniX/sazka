import Modal from "~/components/Modal";
import { myUseState } from "~/hooks/myUseState";
import { formatPrice, getClassName } from "~/utils/utils";
import { generateStistkoData, getStistkoConfig } from "~/games/stistko";
import MyButton from "~/my/MyButton";
import { sazkaStore } from "~/stores/sazka";
import { IStistkoData, TStistkoVariant } from "~/interfaces";
import { notificationStore } from "~/stores/notification";
import { STISTKO } from "~/const";

import CloverleafFullImg from "~/assets/sazka/cloverleaf-full.png";
import CloverleafWithoutImg from "~/assets/sazka/cloverleaf-without.png";

import "./style.less";

type TState = "init" | "paid" | "animation" | "reveal";

const ANIM_TIMEOUT = 2000;

interface IState {
	drawState: TState;
	maxWinMul: number;
	winData: IStistkoData;
}

interface IStistkoBet {
	variant: TStistkoVariant,
	onClose?: () => void;
}

export default function StistkoBet({
	variant,
	onClose = () => {},
}: IStistkoBet) {
	const { sazka, addBet, addWinPrice } = sazkaStore(sazkaState => ({
		sazka: sazkaState.sazka,
		addBet: sazkaState.addBet,
		addWinPrice: sazkaState.addWinPrice,
	}));
	const config = getStistkoConfig(variant);
	const { state, updateState } = myUseState<IState>({
		winData: {
			prices: Array.from({ length: STISTKO.numbers }),
			winMul: 1,
			winNumber: 0,
			winPrice: 0,
		},
		drawState: "init",
		maxWinMul: config.bet,
	});

	function getBtnText() {
		if (state.drawState === "paid") {
			return `Setřít`;
		}

		return `Vsadit za ${formatPrice(config.bet)}`;
	}

	function makeBet() {
		if (state.drawState === "init" || state.drawState === "reveal") {
			addBet(config.bet);
			notificationStore.getState().setNotification(`Za sázku Štístko bylo strženo ${formatPrice(config.bet)}`);

			const winData = generateStistkoData(variant);

			updateState({
				// vygenerujeme ceny
				drawState: "paid",
				winData,
			});
		} else if (state.drawState === "paid") {
			updateState({
				drawState: "animation",
			});
			setTimeout(() => {
				// vyhodnotime vyhru
				updateState({
					drawState: "reveal",
				});
				// pridame vyhru
				addWinPrice(state.winData.winPrice);
			}, ANIM_TIMEOUT);
		}
	}

	/* eslint-disable react/no-array-index-key */
	return <Modal className="stistkoBetModal" onClose={onClose}>
		<h3 className="stistkoBetModal__title">
			Štístko - Vynásobte svou výhru až <strong>{state.maxWinMul}x</strong>
		</h3>
		<div className="stistkoBetModal__stistkoItems">
			{ state.winData.prices.map((stistkoItem, ind) => <div className={getClassName(["stistkoBetModal__stistkoItem", state.drawState === "animation" ? "animation" : ""])} key={ind}>
				{ state.drawState === "reveal" && <span className="stistkoBetModal__stistkoItemPriceCont">
					<span className={getClassName(["stistkoBetModal__stistkoItemPrice", stistkoItem === state.winData.winNumber ? "selected" : ""])}>
						{ formatPrice(stistkoItem) }
					</span>
				</span> }
				<img src={state.drawState === "animation" ? CloverleafWithoutImg : CloverleafFullImg} />
			</div>) }
		</div>
		<div className="stistkoBetModal__priceInfo">
			{ state.drawState === "reveal" && <span>
				Násobte až <strong>{state.winData.winMul}x</strong>
			</span> }
			{ state.drawState === "reveal" && <span className="stistkoBetModal__winPrice" data-price={state.winData.winPrice > 0 ? "yes" : "no"}>
				Výhra: <strong>{formatPrice(state.winData.winPrice)}</strong>
			</span> }
			{ state.drawState !== "reveal" && <span>
				Čekám na výhru
			</span> }
		</div>
		<div className="stistkoBetModal__betArea">
			<MyButton text={getBtnText()} onClick={makeBet} disabled={(config.bet > sazka.amount && state.drawState === "reveal") || state.drawState === "animation"} />
		</div>
	</Modal>;
}
