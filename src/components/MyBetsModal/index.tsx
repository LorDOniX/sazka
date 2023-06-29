import { useEffect } from "react";

import Modal from "~/components/Modal";
import BetItem from "~/components/BetItem";
import { sazkaStore } from "~/stores/sazka";
import BetDetail from "~/components/BetDetail";
import { IBet } from "~/interfaces";
import { myUseState } from "~/hooks/myUseState";
import MyButton from "~/my/MyButton";
import MySelector from "~/my/MySelector";

import "./style.less";

type TFilter = "all" | "with-price" | "with-price-100" | "with-price-500" | "with-price-1000" | "with-price-10000";

interface IState {
	filter: TFilter;
	betDetail: IBet;
	visible: number;
	count: number;
	waitingItems: Array<IBet>;
	finishedItems: Array<IBet>;
	showMore: boolean;
}

interface IMyBetsModal {
	maxItems?: number;
	onClose?: () => void;
}

const FILTERS: Array<TFilter> = ["all", "with-price", "with-price-100", "with-price-500", "with-price-1000", "with-price-10000"];
const FILTERS_TITLES: Array<string> = ["Vše", "Výhry", "100+ Kč", "500+ Kč", "1000+ Kč", "10000+ Kč"];

export default function MyBetsModal({
	/* eslint-disable-next-line */
	maxItems = 15,
	onClose = () => {},
}: IMyBetsModal) {
	/* eslint-disable no-magic-numbers */
	const { bets } = sazkaStore(sazkaState => ({
		bets: sazkaState.sazka.bets,
	}));

	function filterItems(filter: TFilter, items: Array<IBet>) {
		return items.filter(item => {
			switch (filter) {
				case "all":
					return true;

				case "with-price":
					return item.winPrice > 0;

				case "with-price-100":
					return item.winPrice > 100;

				case "with-price-500":
					return item.winPrice > 500;

				case "with-price-1000":
					return item.winPrice > 1000;

				case "with-price-10000":
					return item.winPrice > 10000;

				default:
					return true;
			}
		});
	}

	function getWaitingItems() {
		const waitingItems = bets.filter(betItem => betItem.state !== "completed");

		return waitingItems;
	}

	function getFinishedData(filter: TFilter, visible: number) {
		const items = bets.filter(betItem => betItem.state === "completed");
		const finishedItems = filterItems(filter, items);

		return {
			finishedItems: finishedItems.slice(0, visible),
			showMore: finishedItems.length > visible,
			count: Math.min(finishedItems.length - visible, maxItems),
		};
	}

	const { state, setState, updateState } = myUseState<IState>(() => {
		const visible = maxItems;
		const filter: TFilter = "all";
		const finishedData = getFinishedData(filter, visible);

		return {
			filter,
			betDetail: null,
			visible,
			waitingItems: getWaitingItems(),
			...finishedData,
		};
	});

	function openDetailBet(betDetail: IBet) {
		updateState({
			betDetail,
		});
	}

	function setFilter(filter: TFilter, visible = maxItems) {
		setState(prev => {
			const finishedData = getFinishedData(filter, visible);

			return {
				...prev,
				filter,
				visible,
				...finishedData,
			};
		});
	}

	function clickShowMore() {
		setFilter(state.filter, state.visible + maxItems);
	}

	useEffect(() => {
		setState(prev => {
			const visible = maxItems;
			const finishedData = getFinishedData(prev.filter, visible);

			return {
				...prev,
				visible,
				waitingItems: getWaitingItems(),
				...finishedData,
			};
		});
	}, [bets]);

	return <Modal className="myBetsModalModal" onClose={onClose} topPosition={true}>
		<div className="myBetsModalModal__content">
			<h2 className="myBetsModalModal__title mainTitle">
				Moje sázky
			</h2>
			<MySelector className="myBetsModalModal__filter" value={state.filter} values={FILTERS} format={(value, ind) => FILTERS_TITLES[ind]} onUpdate={(filter: TFilter) => setFilter(filter)} />
			<h3 className="myBetsModalModal__title">Čekající</h3>
			<div className="myBetsModalModal__items">
				{ state.waitingItems.map(betItem => <BetItem data={betItem} key={betItem.id} onClick={() => openDetailBet(betItem)} />) }
				{ state.waitingItems.length === 0 && <p style={{ marginTop: 0 }}>Prázdné</p>}
			</div>
			<h3 className="myBetsModalModal__title">Slosované</h3>
			<div className="myBetsModalModal__items">
				{ state.finishedItems.map(betItem => <BetItem data={betItem} key={betItem.id} onClick={() => openDetailBet(betItem)} />) }
				{ state.showMore && <MyButton text={`Načíst další ${state.count}`} onClick={clickShowMore} /> }
				{ state.finishedItems.length === 0 && <p style={{ margin: 0 }}>Prázdné</p>}
			</div>
		</div>
		{ state.betDetail && <BetDetail data={state.betDetail} onClose={() => updateState({ betDetail: null })} /> }
	</Modal>;
}