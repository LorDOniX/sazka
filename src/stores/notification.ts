import { create } from 'zustand';

import { INotificationColor } from "~/components/Notification";

interface INotification {
	visible: boolean;
	msg: string;
	color: INotificationColor;
}

interface INotificationStore {
	notification: INotification;
	setNotification: (msg: string, color?: INotificationColor) => void;
	clearNotification: () => void;
}

export const notificationStore = create<INotificationStore>(set => ({
	notification: {
		visible: false,
		msg: "",
		color: "green",
	},
	setNotification: (msg, color = "green") => set(() => ({
		notification: {
			visible: true,
			msg,
			color,
		},
	})),
	clearNotification: () => set(state => ({
		notification: {
			...state.notification,
			visible: false,
		},
	})),
}));
