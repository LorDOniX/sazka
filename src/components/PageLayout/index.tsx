import { Outlet } from "react-router-dom";

import { notificationStore } from "~/stores/notification";
import Menu from "~/components/Menu";
import Notification from "~/components/Notification";

import "./style.less";

export default function PageLayout() {
	const { notification, clearNotification } = notificationStore(notificationState => ({
		notification: notificationState.notification,
		clearNotification: notificationState.clearNotification,
	}));

	return <div className="sazkaPage">
		<Menu showCompleteGames={false} />
		{ notification.visible && <Notification msg={notification.msg} color={notification.color} onHide={() => clearNotification()} /> }
		<Outlet />
	</div>;
}
