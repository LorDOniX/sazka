import { myUseState } from "~/hooks/myUseState";
import { formatPrice, getClassName } from "~/utils/utils";
import { generateStistkoData, getStistkoConfig } from "~/games/stistko";
import MyButton from "~/my/MyButton";
import { sazkaStore } from "~/stores/sazka";
import { IStistkoData, TStistkoVariant } from "~/games/stistko/interfaces";
import { notificationStore } from "~/stores/notification";
import { STISTKO } from "~/games/stistko/const";
import Page from "~/components/Page";
import GoBack from "~/components/GoBack";
import { ROUTES } from "~/const";

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

interface IStistkoBetPage {
	variant: TStistkoVariant,
}

export default function StistkoBetPage({
	variant,
}: IStistkoBetPage) {
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
	return <Page>
		<div className="stistkoBetPage__container">
			<div className="stistkoBetPage__gameContainer">
				<h3 className="stistkoBetPage__title">
					Štístko - Vynásobte svou výhru až <strong>{state.maxWinMul}x</strong>
					<GoBack url={ROUTES.QUICK} />
				</h3>
				<div className="stistkoBetPage__stistkoItems">
					{ state.winData.prices.map((stistkoItem, ind) => <div className={getClassName(["stistkoBetPage__stistkoItem", state.drawState === "animation" ? "animation" : ""])} key={ind}>
						{ state.drawState === "reveal" && <span className="stistkoBetPage__stistkoItemPriceCont">
							<span className={getClassName(["stistkoBetPage__stistkoItemPrice", stistkoItem === state.winData.winNumber ? "selected" : ""])}>
								{ formatPrice(stistkoItem) }
							</span>
						</span> }
						<img src={state.drawState === "animation" ? CloverleafWithoutImg : CloverleafFullImg} />
					</div>) }
					{ state.drawState === "reveal" && <div className="stistkoBetPage__priceCont">
						<div className="stistkoBetPage__priceInfo">
							<span>
								Násobte až <strong>{state.winData.winMul}x</strong>
							</span>
							<span className="stistkoBetPage__winPrice" data-price={state.winData.winPrice > 0 ? "yes" : "no"}>
								Výhra: <strong>{formatPrice(state.winData.winPrice)}</strong>
							</span>
						</div>
					</div> }
				</div>
				<div className="stistkoBetPage__betArea">
					<MyButton text={getBtnText()} onClick={makeBet} disabled={(config.bet > sazka.amount && state.drawState === "reveal") || state.drawState === "animation"} />
				</div>
			</div>
		</div>
	</Page>;
}
