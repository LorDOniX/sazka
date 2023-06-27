import { MouseEvent, ReactNode } from "react";
import CSS from 'csstype';

interface IButtonLink {
	title: ReactNode;
	onClick: () => void;
	className?: string;
	style?: CSS.Properties;
}

export default function ButtonLink({
	title,
	onClick,
	className = "",
	style = {},
}: IButtonLink) {
	function onLinkClick(event: MouseEvent) {
		event.stopPropagation();
		event.preventDefault();
		onClick();
	}

	return <a href="#" onClick={event => onLinkClick(event)} className={className} style={{ fontSize: "var(--default-font-size)", ...style }}>
		{title}
	</a>;
}
