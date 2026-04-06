import {ISearchTickerResultItem, ITickersService} from "./tickers.service.interface";
import {ITickerViewModel} from "../../models/ticker/ticker.view-model.interface";


export class AnonymousUserTickersService implements ITickersService {
    readonly currentTicker: ITickerViewModel | null =  null;
    readonly recentTickers: ITickerViewModel[] = [];

    dispose(): void {
    }

    getTicker(symbol: string): ITickerViewModel {
        throw new Error("Operation not allowed for anonymous user.");
    }

    removeFromRecentTickers(symbol: string): void {
    }

    async searchTicker(query: string): Promise<ISearchTickerResultItem[]> {
        return [];
    }

    async setCurrentTicker(symbol: string): Promise<void> {

    }

}