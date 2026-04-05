import {
    IGreeksRawData,
    IMarketDataProviderService,
    IOptionChainRawData, IQuoteRawData,
    ISearchSymbolItemRawData, ISymbolInfoRawData, ISymbolMetricsRawData, ITradeRawData,
    IWatchListRawData
} from "./market-data-provider.service.interface";


export class AnonymousUserMarketDataProviderService implements IMarketDataProviderService {

    async disposeAsync(): Promise<void> {
    }

    async getOptionsChain(symbol: string): Promise<IOptionChainRawData[]> {
        return [];
    }

    async getPlatformWatchLists(): Promise<IWatchListRawData[]> {
        return [];
    }

    getSymbolGreeks(symbol: string): IGreeksRawData | undefined {
        return undefined;
    }

    async getSymbolInfo(symbol: string): Promise<ISymbolInfoRawData> {
        throw new Error("Operation not allowed for anonymous user. Please login to get symbol info.")
    }

    getSymbolMetrics(symbol: string): Promise<ISymbolMetricsRawData> {
        throw new Error("Operation not allowed for anonymous user. Please login to get symbol metrics.")
    }

    getSymbolQuote(symbol: string): IQuoteRawData | undefined {
        return undefined;
    }

    getSymbolTrade(symbol: string): ITradeRawData | undefined {
        return undefined;
    }

    async getUserWatchLists(): Promise<IWatchListRawData[]> {
        return [];
    }

    async searchSymbol(query: string): Promise<ISearchSymbolItemRawData[]> {
        return [];
    }

    subscribeToStreamer(symbols: string[]): void {
    }

    unsubscribeFromStreamer(symbols: string[]): void {
    }

}