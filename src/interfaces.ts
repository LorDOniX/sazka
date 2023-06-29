import { IKorunkaNa3 } from "~/games/korunka-na3/interfaces";
import { IRychla6 } from "~/games/rychla6/interfaces";
import { IRychleKacky } from "~/games/rychle-kacky/interfaces";
import { ISportka } from "~/games/sportka/interfaces";
import { TStistkoVariant } from "~/games/stistko/interfaces";

export interface IBet {
	id: number;
	state: "new" | "progress" | "completed";
	date: string;
	completeDate: string;
	type: "rychle-kacky" | "sportka" | "rychla6" | "korunka-na-3";
	price: number;
	winPrice: number;
	rychleKacky?: null | IRychleKacky;
	sportka?: null | ISportka;
	rychla6?: null | IRychla6;
	korunkaNa3?: null | IKorunkaNa3;
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

export type TTicketGames = "stistko";

export interface ITicketData {
	stistko?: TStistkoVariant;
}

export interface NumWithProb {
	value: number;
	prob: number;
}
