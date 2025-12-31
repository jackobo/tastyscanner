import {ITickerViewModel} from "../../models/ticker.view-model.interface";

export interface ITickersService {
    readonly currentTicker: ITickerViewModel | null;
    setCurrentTicker(symbol: string): Promise<void>;
    readonly recentTickers: ITickerViewModel[];
}