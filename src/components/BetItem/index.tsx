import { IBet } from "~/interfaces";
import { formatPrice } from "~/utils/utils";
import { getBetInfo } from "~/games/common";

import "./style.less";

interface IBetItem {
	data: IBet;
	onClick?: () => void;
}

export default function BetItem({
	data,
	onClick = () => {},
}: IBetItem) {
	const betInfoData = getBetInfo(data);

	function betOnClick() {
		onClick();
	}

	return <div className="betItem" onClick={betOnClick}>
		<span className="betItem__preview">
			<img src={betInfoData.imgSrc} />
		</span>
		<span className="betItem__gameTitle">
			{ betInfoData.gameTitle }
		</span>
		<span className="betItem__separator" />
		<span className="betItem__titleInfo">
			<span className="betItem__mainTitle">
				{ betInfoData.title }
			</span>
			<span className="betItem__desc">
				{ betInfoData.desc }
			</span>
			<span className="betItem__betPrice">
				{ formatPrice(data.price) }
			</span>
		</span>
		<span className="betItem__priceCont">
			<span className="betItem__price" data-price={data.winPrice > 0 ? "yes" : "no"}>
				{ betInfoData.winPrice }
			</span>
		</span>
		<span className="betItem__separator" />
		<span className="betItem__dateInfo">
			<span className="betItem__dateTitle">
				{ betInfoData.dateTitle }
			</span>
			<span className="betItem__mainDate">
				{ betInfoData.date }
			</span>
		</span>
	</div>;
}
