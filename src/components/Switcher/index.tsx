import ButtonLink from "~/components/ButtonLink";

import "./style.less";

export type TPage = "lotteries" | "quick" | "tickets";

interface ISwitcher {
	selected: TPage;
	onClick: (page: TPage) => void;
}

export default function Switcher({
	selected,
	onClick,
}: ISwitcher) {
	function getLotteryClassName(page: TPage) {
		return page === selected ? "active" : "";
	}

	return <div className="sazkaPage__switcher">
		<ButtonLink title="Svět loterií" onClick={() => onClick("lotteries")} className={getLotteryClassName("lotteries")} />
		<span className="seperator" />
		<ButtonLink title="Rychlé loterie" onClick={() => onClick("quick")} className={getLotteryClassName("quick")} />
		<span className="seperator" />
		<ButtonLink title="Stírací losi" onClick={() => onClick("tickets")} className={getLotteryClassName("tickets")} />
		<span className="seperator" />
	</div>;
}
