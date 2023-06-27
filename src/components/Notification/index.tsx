import { useEffect } from "react";
import { createPortal } from 'react-dom';

import { getClassName } from "~/utils/utils";

import "./style.less";

export type INotificationColor = "green" | "red";

interface INotification {
	msg: string;
	onHide: () => void;
	timeout?: number;
	color?: INotificationColor;
}

export default function Notification({
	msg = "",
	onHide,
	/* eslint-disable-next-line */
	timeout = 6000,
	color = "green",
}: INotification) {
	useEffect(() => {
		const hideTimeout = setTimeout(() => {
			onHide();
		}, timeout);

		return () => {
			clearTimeout(hideTimeout);
		};
	}, [msg]);

	return createPortal(
		<div className="notification">
			<div className={getClassName(["notification__msg", color])}>
				{ msg }
			</div>
		</div>,
		document.querySelector('#portal') || document.body,
	);
}
