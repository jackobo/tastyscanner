import {ITickerViewModel} from "../../models/ticker/ticker.view-model.interface";

export interface ITickersService {
    readonly currentTicker: ITickerViewModel | null;
    setCurrentTicker(symbol: string): Promise<void>;
    readonly recentTickers: ITickerViewModel[];
    removeFromRecentTickers(symbol: string): void;
    searchTicker(query: string): Promise<ISearchTickerResultItem[]>;
}

export interface ISearchTickerResultItem {
    symbol: string;
    description: string;
}