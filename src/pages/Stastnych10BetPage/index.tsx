import { useNavigate } from "react-router-dom";

import Page from "~/components/Page";
import ColumnInfo from "~/components/ColumnInfo";
import NumberTable from "~/components/NumberTable";
import { formatPrice, sortArrayNumbers } from "~/utils/utils";
import { myUseState } from "~/hooks/myUseState";
import MyButton from "~/my/MyButton";
import MyCheckbox from "~/my/MyCheckbox";
import { sazkaStore } from "~/stores/sazka";
import { notificationStore } from "~/stores/notification";
import { ROUTES } from "~/const";
import GoBack from "~/components/GoBack";
import { gameStastnych10, generateStastnych10Chance, generateStastnych10Column, getStastnych10PriceData } from "~/games/stastnych10";
import { STASTNYCH10 } from "~/games/stastnych10/const";
import { IStastnych10Column } from "~/games/stastnych10/interfaces";
import MySelector from "~/my/MySelector";

import "./style.less";

interface IState {
	mode: "ticket" | "column";
	count: number;
	selCol: IStastnych10Column;
	columns: Array<IStastnych10Column>;
	useChance: boolean;
	chance: Array<number>;
	price: number;
}

export default function stastnych10BetPage() {
	const navigate = useNavigate();
	const { sazka } = sazkaStore(sazkaState => ({
		sazka: sazkaState.sazka,
	}));
	const { state, setState, updateState } = myUseState<IState>({
		mode: "ticket",
		count: STASTNYCH10.guessedNumbersMax,
		selCol: null,
		columns: [],
		useChance: true,
		chance: generateStastnych10Chance(),
		price: getStastnych10PriceData([], true).price,
	});

	function addColumn() {
		setState(prev => {
			const columns = [
				...prev.columns,
				{
					guessedNumbers: generateStastnych10Column(state.count),
					index: prev.columns.length + 1,
					bet: STASTNYCH10.pricesPerColumn[0],
					kingGame: true,
					price: 0,
				},
			];

			return {
				...prev,
				...prev.columns.length < STASTNYCH10.maxColumns
					? {
						columns,
						price: getStastnych10PriceData(columns, state.useChance).price,
					}
					: {},
			};
		});
	}

	function fillWholeTicket() {
		const columns: Array<IStastnych10Column> = Array.from({ length: STASTNYCH10.maxColumns }).map((item, ind) => ({
			guessedNumbers: generateStastnych10Column(state.count),
			index: ind + 1,
			bet: STASTNYCH10.pricesPerColumn[0],
			kingGame: true,
			price: 0,
		}));

		updateState({
			columns,
			useChance: true,
			chance: generateStastnych10Chance(),
			price: getStastnych10PriceData(columns, state.useChance).price,
		});
	}

	function removeColumn() {
		setState(prev => {
			const columns = prev.columns.slice(0, prev.columns.length - 1);

			return {
				...prev,
				columns,
				price: getStastnych10PriceData(columns, prev.useChance).price,
			};
		});
	}

	function openColumn(selCol: number) {
		const columnData = state.columns.filter(item => item.index === selCol)[0];

		updateState({
			selCol: {
				...columnData,
				guessedNumbers: columnData.guessedNumbers.slice(),
			},
			mode: "column",
		});
	}

	function backToTicket() {
		updateState({
			selCol: null,
			mode: "ticket",
		});
	}

	function setRandomColumn() {
		setState(prev => ({
			...prev,
			selCol: {
				...prev.selCol,
				guessedNumbers: generateStastnych10Column(state.count),
			},
		}));
	}

	function saveColumn() {
		if (state.selCol.guessedNumbers.length !== state.count) {
			return;
		}

		setState(prev => {
			const columns = prev.columns.slice();
			const column = columns.filter(item => item.index === prev.selCol.index)[0];

			sortArrayNumbers(prev.selCol.guessedNumbers);
			Object.assign(column, prev.selCol);

			return {
				...prev,
				columns,
				price: getStastnych10PriceData(state.columns, prev.useChance).price,
				selCol: null,
				mode: "ticket",
			};
		});
	}

	function makeBet() {
		const msg = gameStastnych10(state.columns, state.useChance ? state.chance : []);

		notificationStore.getState().setNotification(msg);
		navigate(ROUTES.ROOT);
	}

	function getBetDisabled() {
		return state.price > sazka.amount || state.price === 0 || state.columns.length < STASTNYCH10.minColumns;
	}

	function updateColumnState(columnState: Partial<IStastnych10Column>) {
		setState(prev => ({
			...prev,
			selCol: {
				...prev.selCol,
				...columnState,
			},
		}));
	}

	function updateChance(useChance: boolean) {
		updateState({
			useChance,
			price: getStastnych10PriceData(state.columns, useChance).price,
		});
	}

	return <Page>
		<h3 className="stastnych10BetPage__title">
			Štastných 10
			<GoBack url={ROUTES.ROOT} />
		</h3>
		{ state.mode === "ticket" && <div className="stastnych10BetPage__ticketContent">
			<div className="stastnych10BetPage__columns">
				{ state.columns.map(column => <div className="stastnych10BetPage__columnItem" key={column.index} onClick={() => openColumn(column.index)}>
					<h3 className="stastnych10BetPage__columnItemTitle">Slupec {column.index}</h3>
					<ColumnInfo numbers={column.guessedNumbers} drawNumbers={[]} />
				</div>) }
			</div>
			<div className="stastnych10BetPage__columnsControls">
				<MyButton text="Přidat sloupec" onClick={addColumn} disabled={state.columns.length === STASTNYCH10.maxColumns} />
				<MyButton text="Smazat sloupec" onClick={removeColumn} disabled={state.columns.length <= 1} />
				<MyButton text="Celý ticket" onClick={fillWholeTicket} />
			</div>
			<div className="stastnych10BetPage__separator" />
			<h3 className="stastnych10BetPage__columnItemTitle">Šance</h3>
			<div className="stastnych10BetPage__chanceArea">
				<ColumnInfo numbers={state.chance} drawNumbers={[]} />
				<MyButton text="Generovat" onClick={() => updateState({ chance: generateStastnych10Chance() })} />
				<MyCheckbox text="Hrát včetně Šance" value={state.useChance} onChange={updateChance} />
			</div>
			<div className="stastnych10BetPage__separator" />
			<div className="stastnych10BetPage__betArea">
				<span>
					Cena: <strong>{formatPrice(state.price)}</strong>
				</span>
				<MyButton text="Vsadit" onClick={makeBet} disabled={getBetDisabled()} />
			</div>
		</div> }
		{ state.mode === "column" && <div className="stastnych10BetPage__columnContent">
			<div className="stastnych10BetPage__columnDetail">
				<h3>Slupec {state.selCol?.index}</h3>
				<NumberTable min={STASTNYCH10.min} max={STASTNYCH10.max} perLine={STASTNYCH10.perLine} selectCount={state.count} selected={state.selCol.guessedNumbers}
					onSelect={guessedNumbers => setState(prev => ({ ...prev, selCol: { ...prev.selCol, guessedNumbers } }))} />
				<h4>Kolik chcete vsadit?</h4>
				<MySelector values={STASTNYCH10.pricesPerColumn} value={state.selCol.bet} onChange={(bet: number) => updateColumnState({ bet })} />
				<h4>Královská hra?</h4>
				<div>
					<MyCheckbox text="Hrát královskou hru" value={state.selCol.kingGame} onChange={kingGame => updateColumnState({ kingGame })} />
				</div>
				<div className="stastnych10BetPage__columnContentControls">
					<MyButton text="Náhodně" onClick={setRandomColumn} />
					<MyButton text="Uložit" onClick={saveColumn} />
					<MyButton text="Zpět" onClick={backToTicket} />
				</div>
			</div>
		</div> }
	</Page>;
}
