import CSS from 'csstype';

import { getClassName } from "~/utils/utils";

import "./style.less";

interface IMyButton {
	text: string;
	className?: string;
	onClick?: () => void;
	style?: CSS.Properties;
	disabled?: boolean;
}

export default function MyButton({
	text,
	className = "",
	onClick = () => {},
	style = {},
	disabled = false,
}: IMyButton) {
	return <button type="button" onClick={() => onClick()} className={getClassName(["myButton", className])} style={style} disabled={disabled}>
		{ text }
	</button>;
}
