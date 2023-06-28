import { getClassName } from "~/utils/utils";

import "./style.less";

interface IMySelector {
	value: string | number;
	values: Array<string | number>;
	className?: string;
	onUpdate?: (newValue: string | number) => void;
	format?: (value: string | number, ind: number) => string | number;
}

export default function MySelector({
	value,
	values,
	className = "",
	onUpdate = () => {},
	format = formatValue => formatValue,
}: IMySelector) {
	return <div className={getClassName(["mySelector", className])}>
		{ values.map((valueItem, ind) => <div key={valueItem} className={getClassName(["mySelector_item", valueItem === value ? "active" : ""])} onClick={() => onUpdate(valueItem)}>
			{ format(valueItem, ind) }
		</div>) }
	</div>;
}
