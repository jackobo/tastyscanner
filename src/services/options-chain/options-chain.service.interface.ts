import {ITickerViewModel} from "../../models/ticker.view-model.interface";

export interface IOptionsChainService {
    currentTicker: ITickerViewModel | null;
    readonly tickers: ITickerViewModel[];
}