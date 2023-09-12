import { useNavigate } from "react-router-dom";

import { sazkaStore } from "~/stores/sazka";
import Page from "~/components/Page";
import Tickets from "~/components/Tickets";
import { ITicketData, TTicketGames } from "~/interfaces";
import { ROUTES } from "~/const";

export default function TicketsPage() {
	const navigate = useNavigate();
	const { sazka } = sazkaStore(sazkaState => ({
		sazka: sazkaState.sazka,
	}));

	function onTicketGame(game: TTicketGames, data: ITicketData) {
		if (game === "stistko") {
			let link = ROUTES.STISTKO5;

			if (data.stistko === "stistko10") {
				link = ROUTES.STISTKO10;
			} else if (data.stistko === "stistko20") {
				link = ROUTES.STISTKO20;
			}

			navigate(link);
		} else if (game === "kostky") {
			navigate(ROUTES.DICES);
		}
	}

	return <Page>
		<Tickets amount={sazka.amount} onGame={onTicketGame} />
	</Page>;
}
