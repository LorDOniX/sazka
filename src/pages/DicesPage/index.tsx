/* eslint-disable no-magic-numbers */
import { useEffect } from "react";

import Page from "~/components/Page";
import Dice from "~/components/Dice";
import { INIT_SEL } from "~/games/dice/const";
import { TFiveDicesSelection, TGameState } from "~/games/dice/interfaces";
import { myUseState } from "~/hooks/myUseState";
import { useDices } from "~/hooks/useDices";
import MyButton from "~/my/MyButton";
import { getPcSelection, getRank } from "~/games/dice/utils";

import "./style.less";

interface IState {
	gameState: TGameState;
	winner: "pc" | "user" | "none";
}

interface IDiceState {
	roll: boolean;
	useSelection: boolean;
	selection: TFiveDicesSelection;
	winSelection: TFiveDicesSelection;
	rank: null | ReturnType<typeof getRank>;
}

const INIT_STATE: IState = {
	gameState: "init",
	winner: "none",
};

const INIT_DICE_STATE: IDiceState = {
	roll: false,
	useSelection: false,
	selection: [...INIT_SEL] as TFiveDicesSelection,
	winSelection: [...INIT_SEL] as TFiveDicesSelection,
	rank: null,
};

export default function DicesPage() {
	const { state, updateState } = myUseState<IState>({
		...INIT_STATE,
	});
	const { state: userState, updateState: userUpdateState, setState: userSetState } = myUseState<IDiceState>({
		...INIT_DICE_STATE,
	});
	const { state: pcState, updateState: pcUpdateState, setState: pcSetState } = myUseState<IDiceState>({
		...INIT_DICE_STATE,
	});
	const userDice = useDices({
		roll: userState.roll,
		useSelection: userState.useSelection,
		selection: userState.selection,
	});
	const pcDice = useDices({
		roll: pcState.roll,
		useSelection: pcState.useSelection,
		selection: pcState.selection,
	});

	function handleState(gameState: TGameState) {
		switch (gameState) {
			case "init": {
				updateState({
					gameState: "user-roll",
					winner: "none",
				});
				handleState("user-roll");
				break;
			}

			case "user-roll":
				userUpdateState({
					roll: true,
				});
				break;

			case "pc-roll":
				pcUpdateState({
					roll: true,
				});
				break;

			case "user-pick":
				updateState({
					gameState: "user-pick",
				});
				userUpdateState({
					roll: true,
					useSelection: true,
					winSelection: [...INIT_SEL] as TFiveDicesSelection,
				});
				break;

			case "pc-pick":
				updateState({
					gameState: "pc-pick",
				});
				pcSetState(prev => ({
					...prev,
					roll: true,
					useSelection: true,
					winSelection: [...INIT_SEL] as TFiveDicesSelection,
					selection: getPcSelection(prev.rank),
				}));
				break;

			case "end":
				userUpdateState({
					...INIT_DICE_STATE,
				});
				pcUpdateState({
					...INIT_DICE_STATE,
				});
				updateState({
					...INIT_STATE,
				});
				break;

			default:
		}
	}

	function btnClick() {
		handleState(state.gameState);
	}

	function getBtnTitle() {
		switch (state.gameState) {
			case "user-roll":
				return "Hází hráč";

			case "pc-roll":
				return "Hází počítač";

			case "pc-pick":
				return "Počítač vybírá kostky";

			case "user-pick":
				return "Hodit s vybranýma kostkama";

			case "end":
				return "Začít novou hru";

			default:
		}

		return "Začít hru";
	}

	function selDice(ind: number) {
		if (state.gameState !== "user-pick") {
			return;
		}

		userSetState(prev => {
			const selection = prev.selection.slice() as TFiveDicesSelection;

			selection[ind] = !selection[ind];

			return {
				...prev,
				selection,
			};
		});
	}

	function getBtnDisable() {
		return state.gameState !== "init" && state.gameState !== "user-pick" && state.gameState !== "end";
	}

	useEffect(() => {
		if (userDice.rollingDone) {
			const rank = getRank(userDice.dices);

			userUpdateState({
				roll: false,
				selection: [...INIT_SEL] as TFiveDicesSelection,
				winSelection: rank.selection,
				rank,
			});

			if (state.gameState === "user-roll") {
				updateState({
					gameState: "pc-roll",
				});
				handleState("pc-roll");
			} else if (state.gameState === "user-pick") {
				updateState({
					gameState: "pc-pick",
				});
				handleState("pc-pick");
			}
		}
	}, [state, userDice.rollingDone]);

	useEffect(() => {
		if (pcDice.rollingDone) {
			const rank = getRank(pcDice.dices);

			pcUpdateState({
				roll: false,
				selection: [...INIT_SEL] as TFiveDicesSelection,
				winSelection: rank.selection,
				rank,
			});

			if (state.gameState === "pc-roll") {
				updateState({
					gameState: "user-pick",
				});
			} else if (state.gameState === "pc-pick") {
				updateState({
					gameState: "end",
					winner: userState.rank.diceValue > rank.diceValue
						? "user"
						: "pc",
				});
			}
		}
	}, [state, pcDice.rollingDone]);

	return <Page>
		<div className="dicePage__diceContent">
			<div className="dicePage__diceLine">
				<div className="dicePage__diceArea">
					<Dice value={pcDice.dices[0]} selected={pcState.selection[0]} selectedWin={pcState.winSelection[0]} />
					<Dice value={pcDice.dices[1]} selected={pcState.selection[1]} selectedWin={pcState.winSelection[1]} />
					<Dice value={pcDice.dices[2]} selected={pcState.selection[2]} selectedWin={pcState.winSelection[2]} />
					<Dice value={pcDice.dices[3]} selected={pcState.selection[3]} selectedWin={pcState.winSelection[3]} />
					<Dice value={pcDice.dices[4]} selected={pcState.selection[4]} selectedWin={pcState.winSelection[4]} />
				</div>
				<div className="dicePage__diceRank">
					{ pcState.rank ? `${pcState.rank.rank} - ${pcState.rank.diceValue} - ${pcState.rank.selection.map(item => item ? 1 : 0).join("-")}` : "" }
				</div>
			</div>
			<div className="dicePage__diceLine">
				<div className="dicePage__diceArea">
					<Dice value={userDice.dices[0]} selected={userState.selection[0]} onClick={() => selDice(0)} selectedWin={userState.winSelection[0]} />
					<Dice value={userDice.dices[1]} selected={userState.selection[1]} onClick={() => selDice(1)} selectedWin={userState.winSelection[1]} />
					<Dice value={userDice.dices[2]} selected={userState.selection[2]} onClick={() => selDice(2)} selectedWin={userState.winSelection[2]} />
					<Dice value={userDice.dices[3]} selected={userState.selection[3]} onClick={() => selDice(3)} selectedWin={userState.winSelection[3]} />
					<Dice value={userDice.dices[4]} selected={userState.selection[4]} onClick={() => selDice(4)} selectedWin={userState.winSelection[4]} />
				</div>
				<div className="dicePage__diceRank">
					{ userState.rank ? `${userState.rank.rank} - ${userState.rank.diceValue} - ${userState.rank.selection.map(item => item ? 1 : 0).join("-")}` : "" }
				</div>
			</div>
			{ state.gameState === "end" && <div className="dicePage__winner" data-winner={state.winner}>
				<p>Vyhrál - { state.winner === "user" ? "hráč" : "počítač" }</p>
			</div> }
			<div className="dicePage__diceBtns">
				<MyButton text={getBtnTitle()} onClick={btnClick} disabled={getBtnDisable()} />
			</div>
		</div>
	</Page>;
}
