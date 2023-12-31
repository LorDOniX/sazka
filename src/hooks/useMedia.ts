import { useState, useEffect } from "react";

export function useMedia(query: string) {
	const [matches, setMatches] = useState(window.matchMedia(query).matches);

	// cDM, cDU
	useEffect(() => {
		const media = window.matchMedia(query);

		if (media.matches !== matches) {
			setMatches(media.matches);
		}

		const listener = () => {
			setMatches(media.matches);
		};

		media.addEventListener("change", listener);

		return () => {
			media.removeEventListener("change", listener);
		};
	}, [query]);

	return matches;
}
