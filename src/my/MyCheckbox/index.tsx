import { getClassName } from "~/utils/utils";

import "./style.less";

interface IMyCheckbox {
	text: string;
	value: boolean;
	className?: string;
	disabled?: boolean;
	onChange?: (checked: boolean) => void;
}

export default function MyCheckbox({
	text,
	value,
	className = "",
	disabled = false,
	onChange = () => {},
}: IMyCheckbox) {
	return <label className={getClassName(["myCheckbox", className])}>
		<input type="checkbox" checked={value} disabled={disabled} onChange={event => onChange(event.target.checked)} />
		<span className="myCheckbox__title">
			{ text }
		</span>
	</label>;
}
