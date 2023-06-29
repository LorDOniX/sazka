import { useNavigate } from "react-router-dom";

import ButtonLink from "~/components/ButtonLink";

import "./style.less";

interface IGoBack {
	url: string;
}

export default function GoBack({
	url,
}: IGoBack) {
	const navigate = useNavigate();

	return <ButtonLink title="Jít zpět" onClick={() => navigate(url)} className="goBack" />;
}
