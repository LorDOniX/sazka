import CSS from 'csstype';
import { ReactNode } from "react";

import { getClassName } from "~/utils/utils";

import "./style.less";

interface IMyButton {
	text: ReactNode;
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
