import { useNavigate } from "react-router-dom";

import { formatPrice, getClassName } from "~/utils/utils";
import { sazkaStore } from "~/stores/sazka";
import ButtonLink from "~/components/ButtonLink";
import SportkaCycle from "~/components/SportkaCycle";
import { completeGames } from "~/games/common";
import { ROUTES } from "~/const";

import "./style.less";

interface IMenu {
	showCompleteGames: boolean;
}

export default function Menu({
	showCompleteGames = true,
}: IMenu) {
	const navigate = useNavigate();
	const { sazka, bets } = sazkaStore(sazkaState => ({
		bets: sazkaState.sazka.bets,
		sazka: sazkaState.sazka,
	}));
	const waintingLen = bets.filter(betItem => betItem.state !== "completed").length;

	function getCompleteTitle() {
		return waintingLen > 0 ? `Slosovat (${waintingLen})` : `Slosovat`;
	}

	return <div className="sazkaPage__menu">
		<div className="sazkaPage__leftPart">
			<ButtonLink title="Loterie" onClick={() => navigate(ROUTES.ROOT)} />
			<span className="sazkaPage__separator" />
			<ButtonLink title="Losy" onClick={() => navigate(ROUTES.TICKETS)} />
			<span className="sazkaPage__separator" />
		</div>
		<div className="sazkaPage__rightPart">
			<span className="sazkaPage__separator" />
			<SportkaCycle />
			{ showCompleteGames && <>
				<span className="sazkaPage__separator" />
				<ButtonLink title={getCompleteTitle()} onClick={() => completeGames()} className={getClassName(["sazkaPage__menuComplete", waintingLen === 0 ? "disabled" : ""])} />
			</> }
			<span className="sazkaPage__separator" />
			<ButtonLink title="Moje sázky" onClick={() => navigate(ROUTES.MY_BETS)} />
			<span className="sazkaPage__separator" />
			<ButtonLink title={<>Roman<span className="sazkaPage__menuAmount">{formatPrice(sazka.amount)}</span></>} onClick={() => navigate(ROUTES.MY_PROFILE)} style={{ textAlign: "right" }} />
		</div>
	</div>;
}
