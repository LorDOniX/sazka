import { sazkaStore } from "~/stores/sazka";
import Page from "~/components/Page";
import RychleKacky from "~/components/RychleKacky";
import Rychla6 from "~/components/Rychla6";
import KorunkaNa3 from "~/components/KorunkaNa3";

import "./style.less";

export default function QuickLotteriesPage() {
	const { sazka } = sazkaStore(sazkaState => ({
		sazka: sazkaState.sazka,
	}));

	return <Page switcher="quick">
		<div className="quickLotteriesPage__containerQuick">
			<RychleKacky amount={sazka.amount} />
			<Rychla6 amount={sazka.amount} />
			<KorunkaNa3 amount={sazka.amount} />
		</div>
	</Page>;
}
