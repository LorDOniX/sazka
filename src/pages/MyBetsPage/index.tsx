import { useEffect } from "react";

import Page from "~/components/Page";
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
	allWaiting: number;
	allFinished: number;
	visibleWaiting: number;
	visibleFinish: number;
	countWaiting: number;
	countFinished: number;
	waitingItems: Array<IBet>;
	finishedItems: Array<IBet>;
	showMoreWaiting: boolean;
	showMoreFinished: boolean;
}

const FILTERS: Array<TFilter> = ["all", "with-price", "with-price-100", "with-price-500", "with-price-1000", "with-price-10000"];
const FILTERS_TITLES: Array<string> = ["Vše", "Výhry", "100+ Kč", "500+ Kč", "1000+ Kč", "10000+ Kč"];
const MAX_ITEMS = 15;

export default function MyBetsPage() {
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
					return item.winPrice >= 100;

				case "with-price-500":
					return item.winPrice >= 500;

				case "with-price-1000":
					return item.winPrice >= 1000;

				case "with-price-10000":
					return item.winPrice >= 10000;

				default:
					return true;
			}
		});
	}

	function getWaitingData(visibleWaiting: number): Pick<IState, "waitingItems" | "showMoreWaiting" | "countWaiting" | "allWaiting"> {
		const items = bets.filter(betItem => betItem.state !== "completed");
		const len = items.length;

		return {
			allWaiting: len,
			waitingItems: items.slice(0, visibleWaiting),
			showMoreWaiting: len > visibleWaiting,
			countWaiting: Math.max(Math.min(len - visibleWaiting, MAX_ITEMS), 0),
		};
	}

	function getFinishedData(filter: TFilter, visibleFinish: number): Pick<IState, "finishedItems" | "showMoreFinished" | "countFinished" | "allFinished"> {
		const items = bets.filter(betItem => betItem.state === "completed");
		const finishedItems = filterItems(filter, items);

		return {
			allFinished: items.length,
			finishedItems: finishedItems.slice(0, visibleFinish),
			showMoreFinished: finishedItems.length > visibleFinish,
			countFinished: Math.max(Math.min(finishedItems.length - visibleFinish, MAX_ITEMS), 0),
		};
	}

	const { state, setState, updateState } = myUseState<IState>(() => {
		const visibleWaiting = MAX_ITEMS;
		const visibleFinish = MAX_ITEMS;
		const filter: TFilter = "all";
		const waitingData = getWaitingData(visibleWaiting);
		const finishedData = getFinishedData(filter, visibleFinish);

		return {
			filter,
			betDetail: null,
			visibleWaiting,
			visibleFinish,
			...waitingData,
			...finishedData,
		};
	});

	function openDetailBet(betDetail: IBet) {
		updateState({
			betDetail,
		});
	}

	function setFilter(filter: TFilter, visibleFinish = MAX_ITEMS) {
		setState(prev => {
			const finishedData = getFinishedData(filter, visibleFinish);

			return {
				...prev,
				filter,
				visibleFinish,
				...finishedData,
			};
		});
	}

	function clickShowMoreFinished() {
		setFilter(state.filter, state.visibleFinish + MAX_ITEMS);
	}

	function clickShowMoreWaiting() {
		setState(prev => {
			const visibleWaiting = prev.visibleWaiting + MAX_ITEMS;
			const waitingData = getWaitingData(visibleWaiting);

			return {
				...prev,
				visibleWaiting,
				...waitingData,
			};
		});
	}

	function getTitle(msg: string, count: number) {
		return `${msg}${count > 0 ? ` (${count})` : ""}`;
	}

	useEffect(() => {
		setState(prev => {
			const visibleWaiting = MAX_ITEMS;
			const visibleFinish = MAX_ITEMS;
			const waitingData = getWaitingData(visibleWaiting);
			const finishedData = getFinishedData(prev.filter, visibleFinish);

			return {
				...prev,
				visibleWaiting,
				visibleFinish,
				...waitingData,
				...finishedData,
			};
		});
	}, [bets]);

	return <Page>
		<div className="myBetsPage__content">
			<h2 className="myBetsPage__title mainTitle">
				Moje sázky
			</h2>
			<MySelector className="myBetsPage__filter" value={state.filter} values={FILTERS} format={(value, ind) => FILTERS_TITLES[ind]} onChange={(filter: TFilter) => setFilter(filter)} />
			<h3 className="myBetsPage__title">
				{ getTitle("Čekající", state.allWaiting) }
			</h3>
			<div className="myBetsPage__items">
				{ state.waitingItems.map(betItem => <BetItem data={betItem} key={betItem.id} onClick={() => openDetailBet(betItem)} />) }
				{ state.showMoreWaiting && <MyButton text={`Načíst další ${state.countWaiting}`} onClick={clickShowMoreWaiting} /> }
				{ state.waitingItems.length === 0 && <p style={{ marginTop: 0 }}>Prázdné</p>}
			</div>
			<h3 className="myBetsPage__title">
				{ getTitle("Slosované", state.allFinished) }
			</h3>
			<div className="myBetsPage__items">
				{ state.finishedItems.map(betItem => <BetItem data={betItem} key={betItem.id} onClick={() => openDetailBet(betItem)} />) }
				{ state.showMoreFinished && <MyButton text={`Načíst další ${state.countFinished}`} onClick={clickShowMoreFinished} /> }
				{ state.finishedItems.length === 0 && <p style={{ margin: 0 }}>Prázdné</p>}
			</div>
		</div>
		{ state.betDetail && <BetDetail data={state.betDetail} onClose={() => updateState({ betDetail: null })} /> }
	</Page>;
}
