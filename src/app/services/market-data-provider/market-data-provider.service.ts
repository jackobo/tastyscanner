import {
    IAccountRawData,
    IGreeksRawData,
    IMarketDataProviderService,
    IOptionChainRawData, IOrderRequest,
    IQuoteRawData, ISearchSymbolItemRawData, ISymbolInfoRawData, ISymbolMetricsRawData,
    ITradeRawData, IWatchListRawData
} from "./market-data-provider.service.interface";
import {TastyMarketDataProvider} from "./tasty-market-data-provider";
import {AppServiceBase} from "../app-service-base";

export class MarketDataProviderService extends AppServiceBase implements IMarketDataProviderService {


    private _currentProvider: IMarketDataProviderService = new TastyMarketDataProvider(this.services);

    async waitForConnection(): Promise<void> {
        await this._currentProvider.waitForConnection();
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

    getSymbolMetrics(symbol: string): Promise<ISymbolMetricsRawData | null> {
        return this._currentProvider.getSymbolMetrics(symbol);
    }
    async getSymbolInfo(symbol: string): Promise<ISymbolInfoRawData> {
        return this._currentProvider.getSymbolInfo(symbol);
    }

    searchSymbol(query: string): Promise<ISearchSymbolItemRawData[]> {
        return this._currentProvider.searchSymbol(query);
    }

    async getAccounts(): Promise<IAccountRawData[]> {
        return await this._currentProvider.getAccounts();
    }

    sendOrder(accountNumber: string, order: IOrderRequest): Promise<void> {
        return this._currentProvider.sendOrder(accountNumber, order);
    }
}