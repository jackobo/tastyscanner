export interface IMarketDataProviderService {
    waitForConnection(): Promise<void>;
    getOptionsChain(symbol: string): Promise<IOptionChainRawData[]>;
    subscribe(symbols: string[]): void;
    unsubscribe(symbols: string[]): void;
    getSymbolQuote(symbol: string): IQuoteRawData | undefined;
    getSymbolTrade(symbol: string): ITradeRawData | undefined;
    getSymbolGreeks(symbol: string): IGreeksRawData | undefined;
    getUserWatchLists(): Promise<IWatchListRawData[]>;
    getPlatformWatchLists(): Promise<IWatchListRawData[]>;
    getSymbolMetrics(symbol: string): Promise<ISymbolMetricsRawData | null>;
    getSymbolInfo(symbol: string): Promise<ISymbolInfoRawData>;
    searchSymbol(query: string): Promise<ISearchSymbolItemRawData[]>;
}

export interface IMarketDataProvider extends IMarketDataProviderService {
    readonly name: string;
}

export interface IOptionChainRawData {
    expirations: IOptionsExpirationRawData[];
}

export interface IOptionsExpirationRawData {
    expirationDate: string;
    daysToExpiration: number;
    expirationType: string;
    settlementType: string;
    strikes: IOptionStrikeRawData[];
}

export interface IOptionStrikeRawData {
    strikePrice: number;
    callId: string;
    putId: string;
    callStreamerSymbol: string;
    putStreamerSymbol: string;
}

export interface ITradeRawData {
    price: number;
}

export interface IQuoteRawData {
    bidPrice: number;
    askPrice: number;
}

export interface IGreeksRawData {
    delta: number;
    volatility: number;
    theta: number;
    gamma: number;
    rho: number;
    vega: number;
    time: number;
}

export interface IWatchListRawData {
    name: string;
    entries: string[];
}

export interface ISymbolEarningsRawData {
    expectedReportDate: string;
    actualEarningsPerShare: string;
}

export interface ISymbolMetricsRawData {
    impliedVolatilityPercentile: number;
    liquidityRank: number;
    impliedVolatilityIndex: number;
    impliedVolatilityIndexRank: number;
    beta: number;
    earnings?: ISymbolEarningsRawData;
}

export interface ISymbolInfoRawData {
    description: string;
    listedMarket: string;
}

export interface ISearchSymbolItemRawData {
    symbol: string;
    description: string;
}


