import { ReactNode } from "react";

import Switcher, { TPage } from "~/components/Switcher";

import "./style.less";

interface IPage {
	children: ReactNode;
	switcher?: TPage;
}

export default function Page({
	children,
	switcher = "none",
}: IPage) {
	return <>
		{ switcher !== "none" && <Switcher selected={switcher} /> }
		<div className="sazkaPage__container">
			{ children }
		</div>
	</>;
}
