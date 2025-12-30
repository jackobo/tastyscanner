import {ITickerViewModel} from "../../models/ticker.view-model.interface";

export interface IOptionsChainService {
    currentTicker: ITickerViewModel;
    readonly tickers: ITickerViewModel[];
}