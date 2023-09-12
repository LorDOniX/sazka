import { IStastnych10 } from "~/games/stastnych10/interfaces";
import { IKorunkaNa3 } from "~/games/korunka-na3/interfaces";
import { IKorunkaNa4 } from "~/games/korunka-na4/interfaces";
import { IKorunkaNa5 } from "~/games/korunka-na5/interfaces";
import { IRychla6 } from "~/games/rychla6/interfaces";
import { IRychleKacky } from "~/games/rychle-kacky/interfaces";
import { ISportka } from "~/games/sportka/interfaces";
import { IEurojackpot } from "~/games/eurojackpot/interfaces";
import { TStistkoVariant } from "~/games/stistko/interfaces";
import { IKasicka } from "./games/kasicka/interfaces";

export interface IBet {
	id: number;
	state: "new" | "progress" | "completed";
	date: string;
	completeDate: string;
	type: "rychle-kacky" | "sportka" | "rychla6" | "korunka-na-3" | "korunka-na-4" | "korunka-na-5" | "stastnych10" | "eurojackpot" | "kasicka";
	price: number;
	winPrice: number;
	rychleKacky?: null | IRychleKacky;
	sportka?: null | ISportka;
	rychla6?: null | IRychla6;
	korunkaNa3?: null | IKorunkaNa3;
	korunkaNa4?: null | IKorunkaNa4;
	korunkaNa5?: null | IKorunkaNa5;
	stastnych10?: null | IStastnych10;
	eurojackpot?: null | IEurojackpot;
	kasicka?: null | IKasicka;
}

export interface ITableItem {
	value: number;
}

export interface ITableLineItem {
	id: string;
	items: Array<ITableItem>;
}

export interface IBetInfo {
	gameTitle: string;
	imgSrc: any;
	title: string;
	desc: string;
	date: string;
	dateTitle: string;
	winPrice: string;
}

export interface ILotteryItem {
	ind: number;
	title: string;
	price: string;
	winPrice: number;
}

export type TTicketGames = "stistko" | "kostky";

export interface ITicketData {
	stistko?: TStistkoVariant;
}

export interface NumWithProb {
	value: number;
	prob: number;
}
