import { sazkaStore } from "~/stores/sazka";
import Sportka from "~/components/Sportka";
import Stastnych10 from "~/components/Stastnych10";
import Page from "~/components/Page";

import "./style.less";

export default function MainPage() {
	const { sazka } = sazkaStore(sazkaState => ({
		sazka: sazkaState.sazka,
	}));

	return <Page switcher="lotteries">
		<Sportka amount={sazka.amount} />
		<Stastnych10 amount={sazka.amount} />
	</Page>;
}
