import MyButton from "~/my/MyButton";
import { TTicketGames, ITicketData } from "~/interfaces";
import { TStistkoVariant } from "~/games/stistko/interfaces";
import { formatPrice } from "~/utils/utils";
import { getStistkoConfigs } from "~/games/stistko";

import "./style.less";

interface ITickets {
	amount: number;
	onGame: (game: TTicketGames, data: ITicketData) => void;
}

export default function Tickets({
	amount,
	onGame = () => {},
}: ITickets) {
	function stistkoGame(type: TStistkoVariant) {
		onGame("stistko", {
			stistko: type,
		});
	}

	return <div className="ticketsContainer">
		<h2 className="ticketsContainer__title">
			Stírací losy
		</h2>
		<div className="ticketsContainer__quickItems">
			<div className="ticketsContainer__stistko">
				<h3 className="ticketsContainer__stistkoTitle">
					Štístko
				</h3>
				<div className="ticketsContainer__separator" />
				{ getStistkoConfigs().map(config => <div className="ticketsContainer__stistkoVariant" key={config.variant}>
					<MyButton className="ticketsContainer__stistkoBtn" text={`Hrát za ${formatPrice(config.bet)}`} onClick={() => stistkoGame(config.variant)}
						disabled={config.bet > amount} />
				</div>) }
			</div>
			<div className="ticketsContainer__stistko">
				<h3 className="ticketsContainer__stistkoTitle">
					Kostky
				</h3>
				<div className="ticketsContainer__separator" />
				<MyButton className="ticketsContainer__stistkoBtn" text="Hrát" onClick={() => onGame("kostky", {})} />
			</div>
		</div>
	</div>;
}
