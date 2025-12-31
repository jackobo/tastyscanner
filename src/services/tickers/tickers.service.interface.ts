import {ITickerViewModel} from "../../models/ticker.view-model.interface";

export interface ITickersService {
    currentTicker: ITickerViewModel | null;
    readonly tickers: ITickerViewModel[];
}