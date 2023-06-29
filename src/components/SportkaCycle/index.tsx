import { useEffect } from "react";

import { myUseState } from "~/hooks/myUseState";
import { completeGames } from "~/games/common";

import "./style.less";

interface IState {
	seconds: number;
}

const MAX_SECONDS = 10;
const TIMEOUT = 1000;

export default function SportkaCycle() {
	const { state, setState } = myUseState<IState>({
		seconds: MAX_SECONDS,
	});

	useEffect(() => {
		const cycleId = setInterval(() => {
			setState(prev => ({
				...prev,
				seconds: prev.seconds === 0 ? MAX_SECONDS : prev.seconds - 1,
			}));
		}, TIMEOUT);

		return () => {
			clearInterval(cycleId);
		};
	});

	useEffect(() => {
		if (state.seconds === 0) {
			completeGames();
		}
	}, [state.seconds]);

	return <div className="sportkaCycle">
		{ state.seconds > 0 && <>Další slosování za { state.seconds } s...</> }
		{ state.seconds === 0 && <>SLOSOVÁNÍ</> }
	</div>;
}
