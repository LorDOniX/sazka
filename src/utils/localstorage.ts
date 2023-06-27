export function setItem(name: string, value: string): void {
	try {
		localStorage.setItem(name, value);
	} catch (exc) {
		/* eslint-disable no-console */
		console.log(exc);
	}
}

export function getItem(name: string): string {
	try {
		return localStorage.getItem(name) || "";
	} catch (exc) {
		return "";
	}
}

export function removeItem(name: string): void {
	try {
		localStorage.removeItem(name);
	} catch (exc) {
		/* eslint-disable no-console */
		console.log(exc);
	}
}
