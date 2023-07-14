import ColumnInfo from "~/components/ColumnInfo";
import { IBet } from "~/interfaces";
import Modal from "~/components/Modal";
import { formatDate, formatPrice, getSameNumbers } from "~/utils/utils";
import { getBetInfo, getLotteries } from "~/games/common";
import MyButton from "~/my/MyButton";
import { myUseState } from "~/hooks/myUseState";
import { getRychleKackyCover } from "~/games/rychle-kacky";
import { getSportkaCover } from "~/games/sportka";
import { getRychla6Cover } from "~/games/rychla6";
import { getKorunkaNa3Cover } from "~/games/korunka-na3";
import { getKorunkaNa4Cover } from "~/games/korunka-na4";
import { getKorunkaNa5Cover } from "~/games/korunka-na5";
import { getStastnych10Cover } from "~/games/stastnych10";

import "./style.less";
import { getEurojackpotCover } from "~/games/eurojackpot";

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
						<div className="betDetailModal__lottery_cover">
							<img src={getRychleKackyCover()} alt="" />
						</div>
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
						<div className="betDetailModal__lottery_cover">
							<img src={getSportkaCover()} alt="" />
						</div>
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
					{ data.type === "eurojackpot" && data.state === "completed" && <div className="betDetailModal__sportka__lottery">
						<div className="betDetailModal__lottery_cover">
							<img src={getEurojackpotCover()} alt="" />
						</div>
						{ data.eurojackpot.columns.map((column, columnInd) => <div key={column.index}>
							<h3 className="betDetailModal__sportka__lotteryTitle margin-bottom">Sloupec {column.index}</h3>
							<ColumnInfo className="betDetailModal__sportka__lotteryColumn" numbers={column.guessedNumbers} drawNumbers={data.eurojackpot.lottery.drawNumbers} />
							<ColumnInfo numbers={column.guessedSecondNumbers} drawNumbers={data.eurojackpot.lottery.drawSecondNumbers} />
							<p>
								Výhra: <strong>{ formatPrice(data.eurojackpot.lottery.columnsPrices[columnInd].price)}</strong>
							</p>
							<div className="betDetailModal__separator"></div>
						</div>) }
						{ data.eurojackpot.hasChance && <div className="betDetailModal__sportka__chance">
							<h3 className="betDetailModal__sportka__lotteryTitle">Šance</h3>
							<ColumnInfo numbers={data.eurojackpot.guessedChance} drawNumbers={data.eurojackpot.lottery.chance} type="chance" />
							<p>
								Výhra: <strong>{ formatPrice(data.eurojackpot.lottery.chancePrice)}</strong>
							</p>
						</div> }
						{ !data.eurojackpot.hasChance && <p>Bez šance</p> }
					</div> }
					{ data.type === "stastnych10" && data.state === "completed" && <div className="betDetailModal__stastnych10__lottery">
						<div className="betDetailModal__lottery_cover">
							<img src={getStastnych10Cover()} alt="" />
						</div>
						{ data.stastnych10.columns.map((column, columnInd) => <div key={column.index}>
							<h3 className="betDetailModal__stastnych10__lotteryTitle margin-bottom">Sloupec {column.index}</h3>
							<ColumnInfo className="betDetailModal__stastnych10__lotteryColumn" numbers={column.guessedNumbers} drawNumbers={data.stastnych10.lottery.drawNumbers} drawAddOn={data.stastnych10.lottery.kingNumber} />
							<p>
								Výhra ({getSameNumbers(column.guessedNumbers, data.stastnych10.lottery.drawNumbers)} / {column.guessedNumbers.length}): <strong>{ formatPrice(data.stastnych10.lottery.columnsPrices[columnInd].price)}</strong>
							</p>
							<div className="betDetailModal__separator"></div>
						</div>) }
						{ data.stastnych10.hasChance && <div className="betDetailModal__stastnych10__chance">
							<h3 className="betDetailModal__stastnych10__lotteryTitle">Šance</h3>
							<ColumnInfo numbers={data.stastnych10.guessedChance} drawNumbers={data.stastnych10.lottery.chance} type="chance" />
							<p>
								Výhra: <strong>{ formatPrice(data.stastnych10.lottery.chancePrice)}</strong>
							</p>
						</div> }
						{ !data.stastnych10.hasChance && <p>Bez šance</p> }
					</div> }
					{ data.type === "rychla6" && <div className="betDetailModal__rychla6__lottery">
						<div className="betDetailModal__lottery_cover">
							<img src={getRychla6Cover()} alt="" />
						</div>
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
						<div className="betDetailModal__lottery_cover">
							<img src={getKorunkaNa3Cover()} alt="" />
						</div>
						{ data.korunkaNa3.lotteries.map((lottery, ind) => <div key={ind}>
							<h3 className="betDetailModal__korunkaNa3__lotteryTitle margin-bottom">Slosování {ind + 1}</h3>
							<ColumnInfo className="betDetailModal__korunkaNa3__lotteryColumn" numbers={data.korunkaNa3.guessedNumbers} drawNumbers={lottery.winNumbers} />
							<p>
								Výhra: <strong>{ formatPrice(lottery.winPrice)}</strong>
							</p>
							<div className="betDetailModal__separator"></div>
						</div>) }
					</div> }
					{ data.type === "korunka-na-4" && <div className="betDetailModal__korunkaNa3__lottery">
						<div className="betDetailModal__lottery_cover">
							<img src={getKorunkaNa4Cover()} alt="" />
						</div>
						{ data.korunkaNa4.lotteries.map((lottery, ind) => <div key={ind}>
							<h3 className="betDetailModal__korunkaNa3__lotteryTitle margin-bottom">Slosování {ind + 1}</h3>
							<ColumnInfo className="betDetailModal__korunkaNa3__lotteryColumn" numbers={data.korunkaNa4.guessedNumbers} drawNumbers={lottery.winNumbers} />
							<p>
								Výhra: <strong>{ formatPrice(lottery.winPrice)}</strong>
							</p>
							<div className="betDetailModal__separator"></div>
						</div>) }
					</div> }
					{ data.type === "korunka-na-5" && <div className="betDetailModal__korunkaNa3__lottery">
						<div className="betDetailModal__lottery_cover">
							<img src={getKorunkaNa5Cover()} alt="" />
						</div>
						{ data.korunkaNa5.lotteries.map((lottery, ind) => <div key={ind}>
							<h3 className="betDetailModal__korunkaNa3__lotteryTitle margin-bottom">Slosování {ind + 1}</h3>
							<ColumnInfo className="betDetailModal__korunkaNa3__lotteryColumn" numbers={data.korunkaNa5.guessedNumbers} drawNumbers={lottery.winNumbers} />
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
