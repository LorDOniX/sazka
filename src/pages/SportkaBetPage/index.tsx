import { useNavigate } from "react-router-dom";

import Page from "~/components/Page";
import { SPORTKA } from "~/games/sportka/const";
import ColumnInfo from "~/components/ColumnInfo";
import NumberTable from "~/components/NumberTable";
import { formatPrice, sortArrayNumbers } from "~/utils/utils";
import { generateSportkaChance, generateSportkaColumn, getSportkaPriceData, gameSportka, generateFavouriteTicket } from "~/games/sportka";
import { myUseState } from "~/hooks/myUseState";
import MyButton from "~/my/MyButton";
import MyCheckbox from "~/my/MyCheckbox";
import { sazkaStore } from "~/stores/sazka";
import { ISportkaColumn } from "~/games/sportka/interfaces";
import { notificationStore } from "~/stores/notification";
import { ROUTES } from "~/const";
import GoBack from "~/components/GoBack";

import "./style.less";

interface IState {
	mode: "ticket" | "column";
	selCol: number;
	selNumbers: Array<number>;
	columns: Array<ISportkaColumn>;
	useChance: boolean;
	chance: Array<number>;
	price: number;
}

export default function SportkaBetPage() {
	const navigate = useNavigate();
	const { sazka } = sazkaStore(sazkaState => ({
		sazka: sazkaState.sazka,
	}));
	const { state, setState, updateState } = myUseState<IState>({
		mode: "ticket",
		selCol: -1,
		selNumbers: [],
		columns: [],
		useChance: true,
		chance: generateSportkaChance(),
		price: getSportkaPriceData(0, true).price,
	});

	function addColumn() {
		setState(prev => ({
			...prev,
			...prev.columns.length < SPORTKA.maxColumns
				? {
					columns: [
						...prev.columns,
						{
							guessedNumbers: generateSportkaColumn(),
							index: prev.columns.length + 1,
						},
					],
					price: getSportkaPriceData(prev.columns.length + 1, state.useChance).price,
				}
				: {},
		}));
	}

	function fillWholeTicket() {
		updateState({
			columns: Array.from({ length: SPORTKA.maxColumns }).map((item, ind) => ({
				guessedNumbers: generateSportkaColumn(),
				index: ind + 1,
			})),
			useChance: true,
			chance: generateSportkaChance(),
			price: getSportkaPriceData(SPORTKA.maxColumns, state.useChance).price,
		});
	}

	function removeColumn() {
		setState(prev => ({
			...prev,
			columns: prev.columns.slice(0, prev.columns.length - 1),
			price: getSportkaPriceData(prev.columns.length - 1, prev.useChance).price,
		}));
	}

	function openColumn(selCol: number) {
		const selNumbers = state.columns.filter(item => item.index === selCol)[0].guessedNumbers.slice();

		updateState({
			selCol,
			selNumbers,
			mode: "column",
		});
	}

	function backToTicket() {
		updateState({
			selCol: -1,
			mode: "ticket",
		});
	}

	function setRandomColumn() {
		updateState({
			selNumbers: generateSportkaColumn(),
		});
	}

	function saveColumn() {
		if (state.selNumbers.length !== SPORTKA.drawNumbers) {
			return;
		}

		setState(prev => {
			const columns = prev.columns.slice();
			const column = columns.filter(item => item.index === prev.selCol)[0];

			column.guessedNumbers = prev.selNumbers.slice();
			sortArrayNumbers(column.guessedNumbers);

			return {
				...prev,
				columns,
				selCol: -1,
				selNumbers: [],
				mode: "ticket",
			};
		});
	}

	function favouriteTicket() {
		updateState({
			...generateFavouriteTicket(),
			useChance: true,
			price: getSportkaPriceData(SPORTKA.maxColumns, true).price,
		});
	}

	function makeBet() {
		const msg = gameSportka(state.columns, state.useChance ? state.chance : []);

		notificationStore.getState().setNotification(msg);
		navigate(ROUTES.ROOT);
	}

	function getBetDisabled() {
		return state.price > sazka.amount || state.price === 0 || state.columns.length < SPORTKA.minColumns;
	}

	function updateChance(useChance: boolean) {
		updateState({
			useChance,
			price: getSportkaPriceData(state.columns.length, useChance).price,
		});
	}

	return <Page>
		<h3 className="sportkaBetPage__title">
			Sportka
			<GoBack url={ROUTES.ROOT} />
		</h3>
		{ state.mode === "ticket" && <div className="sportkaBetPage__ticketContent">
			<div className="sportkaBetPage__columns">
				{ state.columns.map(column => <div className="sportkaBetPage__columnItem" key={column.index} onClick={() => openColumn(column.index)}>
					<h3 className="sportkaBetPage__columnItemTitle">Slupec {column.index}</h3>
					<ColumnInfo numbers={column.guessedNumbers} drawNumbers={[]} />
				</div>) }
			</div>
			<div className="sportkaBetPage__columnsControls">
				<MyButton text="Přidat sloupec" onClick={addColumn} disabled={state.columns.length === SPORTKA.maxColumns} />
				<MyButton text="Smazat sloupec" onClick={removeColumn} />
				<MyButton text="Celý ticket" onClick={fillWholeTicket} />
				<MyButton text="Oblíbená čísla" onClick={favouriteTicket} />
			</div>
			<div className="sportkaBetPage__separator" />
			<h3 className="sportkaBetPage__columnItemTitle">Šance</h3>
			<div className="sportkaBetPage__chanceArea">
				<ColumnInfo numbers={state.chance} drawNumbers={[]} />
				<MyButton text="Generovat" onClick={() => updateState({ chance: generateSportkaChance() })} />
				<MyCheckbox text="Hrát včetně Šance" value={state.useChance} onChange={updateChance} />
			</div>
			<div className="sportkaBetPage__separator" />
			<div className="sportkaBetPage__betArea">
				<span>
					Cena: <strong>{formatPrice(state.price)}</strong>
				</span>
				<MyButton text="Vsadit" onClick={makeBet} disabled={getBetDisabled()} />
			</div>
		</div> }
		{ state.mode === "column" && <div className="sportkaBetPage__columnContent">
			<div className="sportkaBetPage__columnDetail">
				<h3>Slupec {state.selCol}</h3>
				<NumberTable min={SPORTKA.min} max={SPORTKA.max} perLine={SPORTKA.perLine} selectCount={SPORTKA.guessedNumbers} selected={state.selNumbers}
					onSelect={selNumbers => updateState({ selNumbers })} />
				<div></div>
				<div className="sportkaBetPage__columnContentControls">
					<MyButton text="Náhodně" onClick={setRandomColumn} />
					<MyButton text="Uložit" onClick={saveColumn} />
					<MyButton text="Zpět" onClick={backToTicket} />
				</div>
			</div>
		</div> }
	</Page>;
}
