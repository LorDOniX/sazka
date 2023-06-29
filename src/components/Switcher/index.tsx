import { useNavigate } from "react-router-dom";

import ButtonLink from "~/components/ButtonLink";
import { ROUTES } from "~/const";

import "./style.less";

export type TPage = "none" | "lotteries" | "quick";

interface ISwitcher {
	selected: TPage;
}

export default function Switcher({
	selected,
}: ISwitcher) {
	const navigate = useNavigate();

	function getLotteryClassName(page: TPage) {
		return page === selected ? "active" : "";
	}

	return <div className="sazkaPage__switcher">
		<ButtonLink title="Svět loterií" onClick={() => navigate(ROUTES.ROOT)} className={getLotteryClassName("lotteries")} />
		<span className="seperator" />
		<ButtonLink title="Rychlé loterie" onClick={() => navigate(ROUTES.QUICK)} className={getLotteryClassName("quick")} />
		<span className="seperator" />
	</div>;
}
