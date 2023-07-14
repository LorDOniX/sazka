/* eslint-disable no-magic-numbers */
import MyButton from "~/my/MyButton";
import { formatPrice, formatColumns } from "~/utils/utils";
import { generateEurojackpotGame, gameEurojackpot, allInEurojackpot, getEurojackpotCover } from "~/games/eurojackpot";
import { EUROJACKPOT } from "~/games/eurojackpot/const";
import { notificationStore } from "~/stores/notification";
import { ROUTES } from "~/const";
import GameTitle from "~/components/GameTitle";

import "./style.less";

interface IEurojackpot {
	amount: number;
}

interface IItem {
	id: number;
	columns: number;
	chance: boolean;
	title: string;
	line1: string;
	line2: string;
	line3: string;
	price: number;
}

const MIDDLE_COLUMNS = 2;
const RIGHT_COLUMNS = 1;

const items: Array<IItem> = [{
	id: 0,
	columns: EUROJACKPOT.maxColumns,
	chance: true,
	title: "Plný ticket",
	line1: "Náhodný ticket",
	line2: formatColumns(EUROJACKPOT.maxColumns),
	line3: "Včetně Extra 6",
	price: (EUROJACKPOT.maxColumns * EUROJACKPOT.pricePerColumn) + EUROJACKPOT.chancePrice,
}, {
	id: 1,
	columns: MIDDLE_COLUMNS,
	chance: true,
	title: "Miliardy 2x týdně",
	line1: "Náhodný ticket",
	line2: formatColumns(MIDDLE_COLUMNS),
	line3: "Včetně Extra 6",
	price: (MIDDLE_COLUMNS * EUROJACKPOT.pricePerColumn) + EUROJACKPOT.chancePrice,
}, {
	id: 2,
	columns: RIGHT_COLUMNS,
	chance: true,
	title: "Na zkoušku",
	line1: "Náhodný tip",
	line2: formatColumns(RIGHT_COLUMNS),
	line3: "Včetně Extra 6",
	price: (RIGHT_COLUMNS * EUROJACKPOT.pricePerColumn) + EUROJACKPOT.chancePrice,
}];

export default function Eurojackpot({
	amount,
}: IEurojackpot) {
	function addGame(item: IItem, generatedData?: ReturnType<typeof generateEurojackpotGame>) {
		const gameData = generatedData || generateEurojackpotGame(item.columns, item.chance);
		const msg = gameEurojackpot(gameData.columns, gameData.chance);

		notificationStore.getState().setNotification(msg);
	}

	function allIn(item: IItem) {
		const msg = allInEurojackpot(item.columns, item.chance);

		notificationStore.getState().setNotification(msg);
	}

	function createItem(item: IItem, addGameCb: () => void, allInCb?: () => void) {
		return <div key={item.id} className="eurojackpotContainer__quickItem">
			<h3 className="eurojackpotContainer__quickItemTitle">
				{ item.title }
			</h3>
			<span className="eurojackpotContainer__quickItemSeparator" />
			<p className="eurojackpotContainer__quickItemParagraph">
				{ item.line1 }
			</p>
			<p className="eurojackpotContainer__quickItemParagraph">
				{ item.line2 }
			</p>
			<p className="eurojackpotContainer__quickItemParagraph">
				{ item.line3 }
			</p>
			<MyButton className="eurojackpotContainer__quickItemBetBtn" text={`Vsadit za ${formatPrice(item.price)}`} onClick={addGameCb}
				disabled={item.price > amount} />
			<MyButton className="eurojackpotContainer__quickItemBetBtn second" text="Vsadit vše" onClick={allInCb} disabled={item.price > amount || !allInCb} />
		</div>;
	}

	return <div className="eurojackpotContainer">
		<GameTitle title="Eurojackpot" img={getEurojackpotCover()} link={ROUTES.EUROJACKPOT} />
		<div className="eurojackpotContainer__quickItems">
			{ items.map(item => createItem(item, () => addGame(item), () => allIn(item))) }
		</div>
	</div>;
}
