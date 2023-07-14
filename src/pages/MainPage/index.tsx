import { sazkaStore } from "~/stores/sazka";
import Sportka from "~/components/Sportka";
import Stastnych10 from "~/components/Stastnych10";
import Page from "~/components/Page";
import Eurojackpot from "~/components/Eurojackpot";
import Kasicka from "~/components/Kasicka";

import "./style.less";

export default function MainPage() {
	const { sazka } = sazkaStore(sazkaState => ({
		sazka: sazkaState.sazka,
	}));

	return <Page switcher="lotteries">
		<Sportka amount={sazka.amount} />
		<Eurojackpot amount={sazka.amount} />
		<Stastnych10 amount={sazka.amount} />
		<Kasicka amount={sazka.amount} />
	</Page>;
}
