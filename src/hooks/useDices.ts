import { useEffect } from "react";
import { DICES, DICE_CHANGE_TO, DICE_ROLL_TIME, INIT_DICES, MAX_DICE, MIN_DICE } from "~/games/dice/const";
import { TFiveDices, TFiveDicesSelection } from "~/games/dice/interfaces";
import { myUseState } from "./myUseState";
import { getRandomList } from "~/utils/utils";

interface IState {
	dices: TFiveDices;
	rollingDone: boolean;
}

interface IUseDices {
	roll: boolean;
	useSelection?: boolean;
	selection?: TFiveDicesSelection;
	diceTo?: number;
	diceRollTime?: number;
}

export function useDices({
	roll = false,
	useSelection = false,
	selection,
	diceTo = DICE_CHANGE_TO,
	diceRollTime = DICE_ROLL_TIME,
}: IUseDices): IState {
	const { state, updateState, setState } = myUseState<IState>({
		dices: [...INIT_DICES] as TFiveDices,
		rollingDone: false,
	});

	useEffect(() => {
		updateState({
			rollingDone: false,
		});

		if (!roll) {
			return () => {};
		}

		if (useSelection) {
			const count = selection.reduce((allCount, curValue) => allCount + (curValue ? 1 : 0), 0);

			if (count === 0) {
				updateState({
					rollingDone: true,
				});

				return () => {};
			}
		}

		const interval = setInterval(() => {
			setState(prev => {
				const dices = getRandomList(MIN_DICE, MAX_DICE, DICES) as TFiveDices;

				if (useSelection) {
					selection.forEach((isChecked, ind) => {
						if (!isChecked) {
							dices[ind] = prev.dices[ind];
						}
					});
				}

				return {
					...prev,
					dices,
				};
			});
		}, diceTo);

		const timeout = setTimeout(() => {
			clearInterval(interval);
			updateState({
				rollingDone: true,
			});
		}, diceRollTime);

		return () => {
			clearInterval(interval);
			clearTimeout(timeout);
		};
	}, [roll, useSelection, selection]);

	return state;
}
