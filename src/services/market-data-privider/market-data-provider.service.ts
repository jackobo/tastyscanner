import {
    IGreeksRawData,
    IMarketDataProviderService,
    IOptionChainRawData,
    IQuoteRawData,
    ITradeRawData, IWatchListRawData
} from "./market-data-provider.service.interface";
import {TastyMarketDataProvider} from "./tasty-market-data-provider";

export class MarketDataProviderService implements IMarketDataProviderService {

    private _currentProvider: IMarketDataProviderService = new TastyMarketDataProvider();

    async start(): Promise<void> {
        await this._currentProvider.start();
    }
    async getOptionsChain(symbol: string): Promise<IOptionChainRawData[]> {
        return await this._currentProvider.getOptionsChain(symbol);
    }
    subscribe(symbols: string[]): void {
        this._currentProvider.subscribe(symbols);
    }
    unsubscribe(symbols: string[]): void {
        this._currentProvider.unsubscribe(symbols);
    }
    getSymbolQuote(symbol: string): IQuoteRawData | undefined {
        return this._currentProvider.getSymbolQuote(symbol);
    }
    getSymbolTrade(symbol: string): ITradeRawData | undefined {
        return this._currentProvider.getSymbolTrade(symbol);
    }
    getSymbolGreeks(symbol: string): IGreeksRawData | undefined {
        return this._currentProvider.getSymbolGreeks(symbol);
    }

    getUserWatchLists(): Promise<any> {
        return this._currentProvider.getUserWatchLists();
    }

    getPlatformWatchLists(): Promise<IWatchListRawData[]> {
        return this._currentProvider.getPlatformWatchLists();
    }

}