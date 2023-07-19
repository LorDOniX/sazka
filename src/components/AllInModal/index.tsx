import Modal from "~/components/Modal";
import MyButton from "~/my/MyButton";
import { formatPrice } from "~/utils/utils";
import MyNumberWithSet from "~/my/MyNumberWithSet";
import { myUseState } from "~/hooks/myUseState";
import MyCheckbox from "~/my/MyCheckbox";

import "./style.less";

interface IAllInModal {
	amount: number;
	price: number;
	onSave: (count: number, makeCalc: boolean) => void;
	onClose?: () => void;
}

interface IState {
	times: number;
	makeCalc: boolean;
}

/* eslint-disable-next-line */
const PERCENT = [25, 50, 75, 100];

export default function AllInModal({
	amount,
	price,
	onSave,
	onClose = () => {},
}: IAllInModal) {
	const { state, updateState } = myUseState<IState>({
		times: 1,
		makeCalc: true,
	});

	function getTimesByPercent(percent: number) {
		/* eslint-disable-next-line */
		return (amount * (percent / 100) / price) >>> 0;
	}

	function getFirstLine(percent: number) {
		return `${percent}%`;
	}

	function getSecondLine(percent: number) {
		const times = getTimesByPercent(percent);

		return `${times}x - ${formatPrice(times * price)}`;
	}

	function setPercent(percent: number) {
		const times = getTimesByPercent(percent);

		if (times > 0) {
			onSave(times, state.makeCalc);
		} else {
			onClose();
		}
	}

	/* eslint-disable react/no-array-index-key */
	return <Modal className="allInModal" onClose={onClose} outsideAreaClose={true}>
		<div className="allInModal__content">
			<h3 className="allInModal__title">Vybrat počet sázek</h3>
			<div className="allInModal__percentArea">
				{ PERCENT.map(percent => <MyButton text={<>
					<span className="allInModal__buttonFirstLine">{ getFirstLine(percent) }</span>
					<span className="allInModal__buttonSecondLine">{ getSecondLine(percent) }</span>
					{ state.makeCalc && <span className="allInModal__buttonSecondLine">slosovat</span> }
				</>} onClick={() => setPercent(percent)} key={percent} />) }
			</div>
			<div>
				<MyCheckbox text="Zrovna slosovat?" value={state.makeCalc} onChange={makeCalc => updateState({ makeCalc })} />
			</div>
			<div className="allInModal__customArea">
				<MyNumberWithSet min={1} text="Počet sázek:" value={state.times} updatedValue={1} onChange={times => updateState({ times })} />
				<MyButton text={state.makeCalc ? `Nastavit & slosovat` : `Nastavit`} onClick={() => onSave(state.times, state.makeCalc)} />
			</div>
		</div>
	</Modal>;
}
