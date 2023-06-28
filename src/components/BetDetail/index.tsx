import ColumnInfo from "~/components/ColumnInfo";
import { IBet } from "~/interfaces";
import Modal from "~/components/Modal";
import { formatDate, formatPrice, getBetInfo, getLotteries } from "~/utils/utils";
import MyButton from "~/my/MyButton";
import { myUseState } from "~/hooks/myUseState";

import "./style.less";

interface IState {
	showLotteries: boolean;
}

interface IBetItem {
	data: IBet;
	onClose?: () => void;
}

export default function BetDetail({
	data,
	onClose = () => {},
}: IBetItem) {
	const { state, setState } = myUseState<IState>({
		showLotteries: false,
	});
	const betInfoData = getBetInfo(data);

	function toggleLotteries() {
		setState(prev => ({
			...prev,
			showLotteries: !prev.showLotteries,
		}));
	}

	function getPriceDesc() {
		return data.winPrice > 0 ? "Vaše výhra" : "Tentokrát to";
	}

	function getWinPrice() {
		return data.winPrice > 0 ? formatPrice(data.winPrice) : "nevyšlo";
	}

	/* eslint-disable react/no-array-index-key */
	return <Modal className="betDetailModal" onClose={onClose} topPosition={true}>
		<div className="betDetailModal__content">
			<div className="betDetailModal__ticket">
				<div className="betDetailModal__gameTitle">
					{ betInfoData.gameTitle }
				</div>
				<div className="betDetailModal__lotteriesNumbers" data-type={data.type}>
					{ data.type === "rychle-kacky" && <div className="betDetailModal__rychleKacky__lotteriesList">
						{ data.rychleKacky.lotteries.map((lotteryItem, ind) => <div className="betDetailModal__rychleKacky__lotteriesListItem" key={ind}>
							<div className="betDetailModal__rychleKacky__lotteriesListItemInner">
								<h3 className="betDetailModal__rychleKacky__lotteriesListItemTitle">Slosování {ind + 1}</h3>
								<ColumnInfo numbers={data.rychleKacky.guessedNumbers} drawNumbers={lotteryItem.winNumbers} />
								<p>
									Výhra: <strong>{ formatPrice(lotteryItem.winPrice)}</strong>
								</p>
							</div>
							<div className="betDetailModal__separator"></div>
						</div>) }
					</div> }
					{ data.type === "sportka" && data.state === "completed" && <div className="betDetailModal__sportka__lottery">
						{ data.sportka.columns.map((column, columnInd) => <div key={column.index}>
							<h3 className="betDetailModal__sportka__lotteryTitle margin-bottom">Sloupec {column.index}</h3>
							<ColumnInfo className="betDetailModal__sportka__lotteryColumn" numbers={column.guessedNumbers} drawNumbers={data.sportka.lottery.drawNumbers1} drawAddOn={data.sportka.lottery.drawAddOn1} />
							<ColumnInfo numbers={column.guessedNumbers} drawNumbers={data.sportka.lottery.drawNumbers2} drawAddOn={data.sportka.lottery.drawAddOn2} />
							<p>
								Výhra: <strong>{ formatPrice(data.sportka.lottery.columnsPrices[columnInd].price1)}</strong> / <strong>{ formatPrice(data.sportka.lottery.columnsPrices[columnInd].price2)}</strong>
							</p>
							<div className="betDetailModal__separator"></div>
						</div>) }
						{ data.sportka.hasChance && <div className="betDetailModal__sportka__chance">
							<h3 className="betDetailModal__sportka__lotteryTitle">Šance</h3>
							<ColumnInfo numbers={data.sportka.guessedChance} drawNumbers={data.sportka.lottery.chance} type="chance" />
							<p>
								Výhra: <strong>{ formatPrice(data.sportka.lottery.chancePrice)}</strong>
							</p>
						</div> }
						{ !data.sportka.hasChance && <p>Bez šance</p> }
					</div> }
					{ data.type === "rychla6" && <div className="betDetailModal__rychla6__lottery">
						{ data.rychla6.lotteries.map((lottery, ind) => <div key={ind}>
							<h3 className="betDetailModal__rychla6__lotteryTitle margin-bottom">Slosování {ind + 1}</h3>
							<ColumnInfo className="betDetailModal__rychla6__lotteryColumn" numbers={data.rychla6.guessedNumbers} drawNumbers={lottery.winNumbers} />
							<p>
								Výhra: <strong>{ formatPrice(lottery.winPrice)}</strong>
								{lottery.winPrice > 0 ? <span>, pořadí losování <strong>{lottery.winIndex}</strong></span> : null}
							</p>
							<div className="betDetailModal__separator"></div>
						</div>) }
					</div> }
					{ data.type === "korunka-na-3" && <div className="betDetailModal__korunkaNa3__lottery">
						{ data.korunkaNa3.lotteries.map((lottery, ind) => <div key={ind}>
							<h3 className="betDetailModal__korunkaNa3__lotteryTitle margin-bottom">Slosování {ind + 1}</h3>
							<ColumnInfo className="betDetailModal__korunkaNa3__lotteryColumn" numbers={data.korunkaNa3.guessedNumbers} drawNumbers={lottery.winNumbers} />
							<p>
								Výhra: <strong>{ formatPrice(lottery.winPrice)}</strong>
							</p>
							<div className="betDetailModal__separator"></div>
						</div>) }
					</div> }
				</div>
			</div>
			<div className="betDetailModal__info">
				<div className="betDetailModal__infoLine">
					<span>Sázenka č.:</span>
					<strong>{ data.id }</strong>
				</div>
				<div className="betDetailModal__infoSeparator" />
				<div className="betDetailModal__infoLine">
					<span>Slosování:</span>
					<strong>{ betInfoData.desc }</strong>
				</div>
				<div className="betDetailModal__infoSeparator" />
				<div className="betDetailModal__infoLine">
					<span>Celkový vklad:</span>
					<strong>{ formatPrice(data.price) }</strong>
				</div>
				<div className="betDetailModal__infoSeparator" />
				<div className="betDetailModal__infoLine">
					<span>Sázka podána:</span>
					<strong>{ formatDate(data.date) }</strong>
				</div>
				<div className="betDetailModal__infoSeparator" />
				{ data.state !== "new" && <>
					<div className="betDetailModal__infoLine">
						<span>Slosování:</span>
						<strong>{ formatDate(data.completeDate) }</strong>
					</div>
					<div className="betDetailModal__infoSeparator" />
					<div className="betDetailModal__lotteryList">
						<MyButton text="Výpis slosování" onClick={toggleLotteries} />
					</div>
					{ state.showLotteries && <div className="betDetailModal__allLotteries">
						{ getLotteries(data).map(lotteryItem => <div className="betDetailModal__lotteryItem" key={lotteryItem.ind}>
							<span className="betDetailModal__lotteryItemInfo">
								{ lotteryItem.title }
							</span>
							<span className="betDetailModal__lotteryItemPrice" data-price={lotteryItem.winPrice > 0 ? "yes" : "no"}>
								{ lotteryItem.price }
							</span>
						</div>) }
					</div> }
					<div className="betDetailModal__priceInfoCont">
						<div className="betDetailModal__priceInfo" data-price={data.winPrice > 0 ? "yes" : "no"}>
							<span className="betDetailModal__priceDesc">
								{ getPriceDesc() }
							</span>
							<span className="betDetailModal__priceWinPrice">
								{ getWinPrice() }
							</span>
						</div>
					</div>
				</> }
			</div>
		</div>
	</Modal>;
}
