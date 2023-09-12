export type TFiveDices = [number, number, number, number, number];
export type TFiveDicesSelection = [boolean, boolean, boolean, boolean, boolean];
export type TGameState = "init" | "user-roll" | "pc-roll" | "user-pick" | "pc-pick" | "end";
export type TGameRanks = "five-of-a-kind" | "four-of-a-kind" | "fullhouse" | "six-high-straight" | "five-high-straight" | "three-of-a-kind" | "two-pairs" | "pair" | "nothing";
