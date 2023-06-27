import { sazkaStore } from "~/stores/sazka";
import { notificationStore } from "~/stores/notification";
import Menu from "~/components/Menu";
import Switcher, { TPage } from "~/components/Switcher";
import RychleKacky from "~/components/RychleKacky";
import Rychla6 from "~/components/Rychla6";
import Notification from "~/components/Notification";
import StistkoBet from "~/components/StistkoBet";
import Sportka from "~/components/Sportka";
import { myUseState } from "~/hooks/myUseState";
import Tickets from "~/components/Tickets";
import { ITicketData, TStistkoVariant, TTicketGames } from "~/interfaces";

import "./style.less";

interface IState {
	page: TPage;
	openStistko: boolean;
	stistkoVariant: TStistkoVariant;
}

export default function MainPage() {
	const { sazka } = sazkaStore(sazkaState => ({
		sazka: sazkaState.sazka,
	}));
	const { notification, clearNotification } = notificationStore(notificationState => ({
		notification: notificationState.notification,
		clearNotification: notificationState.clearNotification,
	}));
	const { state, updateState } = myUseState<IState>({
		page: "lotteries",
		openStistko: false,
		stistkoVariant: "stistko5",
	});

	function onTicketGame(game: TTicketGames, data: ITicketData) {
		if (game === "stistko") {
			updateState({
				openStistko: true,
				stistkoVariant: data.stistko,
			});
		}
	}

	return <div className="sazkaPage">
		<Menu showCompleteGames={false} />
		<Switcher selected={state.page} onClick={page => updateState({ page })} />
		{ notification.visible && <Notification msg={notification.msg} color={notification.color} onHide={() => clearNotification()} /> }
		<div className="sazkaPage__container">
			{ state.page === "lotteries" && <>
				<Sportka amount={sazka.amount} />
			</> }
			{ state.page === "quick" && <div className="sazkaPage__containerQuick">
				<RychleKacky amount={sazka.amount} />
				<Rychla6 amount={sazka.amount} />
			</div> }
			{ state.page === "tickets" && <>
				<Tickets amount={sazka.amount} onGame={onTicketGame} />
			</> }
		</div>
		{ state.openStistko && <StistkoBet variant={state.stistkoVariant} onClose={() => updateState({ openStistko: false })} /> }
	</div>;
}
