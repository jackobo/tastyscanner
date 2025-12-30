
export interface IOptionsDataProvider {
    start(): Promise<void>;
    getOptionsChain(symbol: string): Promise<IOptionChainRawData[]>;
    subscribe(symbols: string[]): void;
    unsubscribe(symbols: string[]): void;
    getSymbolQuote(symbol: string): IQuoteRawData | undefined;
    getSymbolTrade(symbol: string): ITradeRawData | undefined;
    getSymbolGreeks(symbol: string): IGreeksRawData | undefined;

}

export interface IOptionChainRawData {
    expirations: IOptionsExpirationRawData[];
}

export interface IOptionsExpirationRawData {
    expirationDate: string;
    daysToExpiration: number;
    expirationType: string;
    strikes: IOptionStrikeRawData[];
}

export interface IOptionStrikeRawData {
    strikePrice: number;
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
}