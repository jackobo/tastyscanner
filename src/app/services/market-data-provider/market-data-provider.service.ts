import {
    IGreeksRawData, IMarketDataProvider,
    IMarketDataProviderService,
    IOptionChainRawData,
    IQuoteRawData, ISearchSymbolItemRawData, ISymbolInfoRawData, ISymbolMetricsRawData,
    ITradeRawData, IWatchListRawData
} from "./market-data-provider.service.interface";
import {AppServiceBase} from "../app-service-base";
import {IAppServiceFactory} from "../app-service-factory.interface";

export class MarketDataProviderService extends AppServiceBase implements IMarketDataProviderService {

    constructor(services: IAppServiceFactory, private readonly providers: IMarketDataProvider[]) {
        super(services);
        this._currentProvider = this.providers[0];
    }

    private _currentProvider: IMarketDataProvider;




    async getOptionsChain(symbol: string): Promise<IOptionChainRawData[]> {
        return await this._currentProvider.getOptionsChain(symbol);
    }
    subscribeToStreamer(symbols: string[]): void {
        this._currentProvider.subscribeToStreamer(symbols);
    }

    unsubscribeFromStreamer(symbols: string[]): void {
        this._currentProvider.unsubscribeFromStreamer(symbols);
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


}