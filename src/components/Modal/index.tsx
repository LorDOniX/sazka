import { ReactNode, useRef, useEffect, MouseEvent } from 'react';
import { createPortal } from 'react-dom';

import { getClassName, getRandomHexHash } from "~/utils/utils";
import { KEYS } from "~/const";
import { modalsStore } from "~/stores/modals";

import "./style.less";

interface IModal {
	children: ReactNode;
	className: string;
	hash?: string;
	onClose?: () => void;
	outsideAreaClose?: boolean;
	onClick?: (event: MouseEvent) => void;
	topPosition?: boolean;
}

export default function Modal({
	children = null,
	className = "",
	hash = getRandomHexHash(),
	onClose = () => {},
	outsideAreaClose = false,
	onClick = () => {},
	topPosition,
} : IModal) {
	const { addWindow, removeWindow } = modalsStore(modalsState => ({
		addWindow: modalsState.addWindow,
		removeWindow: modalsState.removeWindow,
	}));
	const modalRef = useRef<HTMLDivElement>(null);
	const innerRef = useRef<HTMLDivElement>(null);
	const mainClassess = ["modal", topPosition ? "top-position" : ""];
	const innerClassess = ["modal-window", className];

	function handleEscape(event: KeyboardEvent) {
		const windows = modalsStore.getState().modals.windows;
		const topWindow = windows[windows.length - 1];

		if (hash === topWindow && event.key === KEYS.ESC) {
			onClose();
		}
	}

	function onModalClick(event: MouseEvent) {
		const target = event.target as HTMLDivElement;

		if (outsideAreaClose && !innerRef?.current?.contains(target)) {
			onClose();
		}

		onClick(event);
	}

	useEffect(() => {
		document.addEventListener('keydown', handleEscape);
		document.body.classList.add("modal-no-scroll");
		addWindow(hash);

		return () => {
			document.body.classList.remove("modal-no-scroll");
			document.removeEventListener('keydown', handleEscape);
			removeWindow(hash);
		};
	}, []);

	return createPortal(
		<div className={getClassName(mainClassess)} ref={modalRef} onClick={onModalClick}>
			<div className={getClassName(innerClassess)} ref={innerRef}>
				<button type="button" onClick={() => onClose()} className="modal-window-btn-close">
					<svg x="0px" y="0px" viewBox="0 0 24 24" className="svg-icon close">
						<path d="M3.6,0.1L0.1,3.6L8.5,12l-8.4,8.4l3.5,3.5l8.4-8.4l8.4,8.4l3.5-3.5L15.5,12l8.4-8.4l-3.5-3.5L12,8.5L3.6,0.1L3.6,0.1z"/>
					</svg>
				</button>
				{children}
			</div>
		</div>,
		document.querySelector('#portal') || document.body,
	);
}
