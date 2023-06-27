import { Dispatch, SetStateAction, useState } from "react";

export function myUseState<T>(initState: T | (() => T)): {
	state: T;
	setState: Dispatch<SetStateAction<T>>;
	updateState: (changes: Partial<T>) => void;
} {
	const [state, setState] = useState<T>(initState);

	function updateState(changes: Partial<T>): void {
		setState(prev => ({ ...prev, ...changes }));
	}

	return {
		state,
		setState,
		updateState,
	};
}
