import { create } from 'zustand';

import { removeFromArray, insertUnique } from '~/utils/utils';

interface IModalsStore {
	modals: {
		windows: Array<string>;
	}
	addWindow: (windowId: string) => void;
	removeWindow: (windowId: string) => void;
}

export const modalsStore = create<IModalsStore>(set => ({
	modals: {
		windows: [],
	},
	addWindow: windowId => set(state => ({
		modals: {
			...state.modals,
			windows: insertUnique(state.modals.windows, windowId),
		},
	})),
	removeWindow: windowId => set(state => ({
		modals: {
			...state.modals,
			windows: removeFromArray(state.modals.windows.slice(), item => item === windowId),
		},
	})),
}));
