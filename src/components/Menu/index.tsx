import { formatPrice, getClassName } from "~/utils/utils";
import { sazkaStore } from "~/stores/sazka";
import ButtonLink from "~/components/ButtonLink";
import { myUseState } from "~/hooks/myUseState";
import MyProfileModal from "~/components/MyProfileModal";
import MyBetsModal from "~/components/MyBetsModal";
import SportkaCycle from "~/components/SportkaCycle";
import { completeGames } from "~/providers/sazka";

import "./style.less";

interface IState {
	showMyProfle: boolean;
	showMyBets: boolean;
}

interface IMenu {
	showCompleteGames: boolean;
}

export default function Menu({
	showCompleteGames = true,
}: IMenu) {
	const { sazka, bets } = sazkaStore(sazkaState => ({
		bets: sazkaState.sazka.bets,
		sazka: sazkaState.sazka,
	}));
	const { state, updateState } = myUseState<IState>({
		showMyProfle: false,
		showMyBets: false,
	});
	const waintingLen = bets.filter(betItem => betItem.state !== "completed").length;

	function getCompleteTitle() {
		return waintingLen > 0 ? `Slosovat (${waintingLen})` : `Slosovat`;
	}

	return <div className="sazkaPage__menu">
		{ waintingLen > 0 && <>
			<span className="seperator" />
			<SportkaCycle />
		</> }
		{ showCompleteGames && <>
			<span className="seperator" />
			<ButtonLink title={getCompleteTitle()} onClick={() => completeGames()} className={getClassName(["sazkaPage__menuComplete", waintingLen === 0 ? "disabled" : ""])} />
		</> }
		<span className="seperator" />
		<ButtonLink title="Moje sázky" onClick={() => updateState({ showMyBets: true })} />
		<span className="seperator" />
		<ButtonLink title={<>Roman<span className="sazkaPage__menuAmount">{formatPrice(sazka.amount)}</span></>} onClick={() => updateState({ showMyProfle: true })} style={{ textAlign: "right" }} />
		{ state.showMyProfle && <MyProfileModal onClose={() => updateState({ showMyProfle: false })} /> }
		{ state.showMyBets && <MyBetsModal onClose={() => updateState({ showMyBets: false })} /> }
	</div>;
}
