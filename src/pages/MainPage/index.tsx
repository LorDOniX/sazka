import { sazkaStore } from "~/stores/sazka";
import Sportka from "~/components/Sportka";
import Page from "~/components/Page";

export default function MainPage() {
	const { sazka } = sazkaStore(sazkaState => ({
		sazka: sazkaState.sazka,
	}));

	return <Page switcher="lotteries">
		<Sportka amount={sazka.amount} />
	</Page>;
}
