import {ITickerViewModel} from "../../models/ticker/ticker.view-model.interface";
import {IDisposable} from "../../../framework/services/disposable.interface";

export interface ITickersService extends IDisposable {
    readonly currentTicker: ITickerViewModel | null;
    setCurrentTicker(symbol: string): Promise<void>;
    getTicker(symbol: string): ITickerViewModel;
    readonly recentTickers: ITickerViewModel[];
    removeFromRecentTickers(symbol: string): void;
    searchTicker(query: string): Promise<ISearchTickerResultItem[]>;
}

export interface ISearchTickerResultItem {
    symbol: string;
    description: string;
}