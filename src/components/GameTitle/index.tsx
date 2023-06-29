import { useNavigate } from "react-router-dom";

import MyButton from "~/my/MyButton";

import "./style.less";

interface IGameTitle {
	title: string;
	img: any;
	link: string;
}

export default function GameTitle({
	title,
	img,
	link,
}: IGameTitle) {
	const navigate = useNavigate();

	return <h2 className="gameTitle">
		<span className="gameTitle__titlePart">
			<img src={img} alt="" />
			{ title }
		</span>
		<MyButton text="Vsadit online" onClick={() => navigate(link)} />
	</h2>;
}
