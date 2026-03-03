import TastyTradeClient, {MarketDataSubscriptionType} from "@tastytrade/api";
import {
    IGreeksRawData,
    IMarketDataProviderService,
    IOptionChainRawData,
    IQuoteRawData,
    ISearchSymbolItemRawData, ISymbolEarningsRawData,
    ISymbolInfoRawData,
    ISymbolMetricsRawData,
    ITradeRawData,
    IWatchListRawData
} from "../../market-data-provider/market-data-provider.service.interface";
import {makeObservable, observable, runInAction} from "mobx";
import {Check} from "../../../../framework/utils/type-checking";

export class TastyMarketDataProvider implements Omit<IMarketDataProviderService, 'getUserWatchLists'> {
    constructor(private readonly tastyClient: TastyTradeClient) {
        makeObservable(this, {
            quotes: observable,
            trades: observable,
            greeks: observable,
        });
    }

    private _lastSymbols: string[] = [];
    private _openPositionsSymbols: string[] = [];


    public async connect(): Promise<void> {
        this.tastyClient.quoteStreamer.addEventListener(this._streamEventHandler);

        try {

            await this.tastyClient.quoteStreamer.connect();
            if(this._lastSymbols.length > 0) {
                this._subscribeToSymbols(this._lastSymbols, this.tastyClient);
            }

        } catch(e) {
            this.tastyClient.quoteStreamer.removeEventListener(this._streamEventHandler);
            throw e;
        }
    }

    public disconnect(): void {
        this.tastyClient.quoteStreamer.removeEventListener(this._streamEventHandler);
        this.tastyClient.quoteStreamer.disconnect();
    }

    public quotes: Record<string, any> = {};
    public trades: Record<string, any> = {};
    public greeks: Record<string, any> = {};

    private _streamEventHandler= (records: any[]) => {
        runInAction(() => {
            for(const record of records) {

                if(record.eventType === "Quote") {
                    this.quotes[record.eventSymbol] = record;
                } else if(record.eventType === "Trade") {
                    this.trades[record.eventSymbol] = record;
                } else if(record.eventType === "Greeks") {
                    //console.log(record);
                    this.greeks[record.eventSymbol] = record;
                }

            }
        })
    }



    async getOptionsChain(symbol: string): Promise<IOptionChainRawData[]> {
        const optionsChain = await this.tastyClient.instrumentsService.getNestedOptionChain(symbol);
        const result: IOptionChainRawData[] = [];


        for(const optionChain of optionsChain) {
            result.push({
                expirations: optionChain.expirations.map((expiration: any) => {
                    return {
                        expirationDate: expiration["expiration-date"],
                        daysToExpiration: expiration["days-to-expiration"],
                        expirationType: expiration["expiration-type"],
                        settlementType: expiration["settlement-type"],
                        strikes: expiration["strikes"]?.map((strike: any) => {

                            return {
                                strikePrice: parseFloat(strike["strike-price"]),
                                callId: strike["call"],
                                callStreamerSymbol: strike["call-streamer-symbol"],
                                putId: strike["put"],
                                putStreamerSymbol: strike["put-streamer-symbol"]
                            };
                        }) ?? []
                    }
                })
            });
        }

        return result;
    }
    subscribe(symbols: string[]): void {
        this._subscribeToSymbols(symbols, this.tastyClient);
        this._lastSymbols = [
            ...this._lastSymbols,
            ...symbols.filter(s => !this._lastSymbols.includes(s))
        ];
    }
    subscribeForOpenPositions(symbols: string[]): void {
        this._subscribeToSymbols(symbols, this.tastyClient);
        this._openPositionsSymbols = symbols;
    }
    unsubscribe(symbols: string[]): void {
        this._unsubscribeFromSymbols(symbols, this.tastyClient, this._openPositionsSymbols);
        this._lastSymbols = this._lastSymbols.filter(s => !symbols.includes(s));
    }
    unsubscribeForOpenPositions(symbols: string[]): void {
        this._unsubscribeFromSymbols(symbols, this.tastyClient, this._lastSymbols);
        this._openPositionsSymbols = this._openPositionsSymbols.filter(s => !symbols.includes(s));
    }
    getSymbolQuote(symbol: string): IQuoteRawData | undefined {
        const quote = this.quotes[symbol];

        if(!quote) {
            return undefined;
        }

        return {
            bidPrice: quote.bidPrice,
            askPrice: quote.askPrice
        };
    }
    getSymbolTrade(symbol: string): ITradeRawData | undefined {
        const trade = this.trades[symbol];
        if(!trade) {
            return undefined;
        }

        return {
            price: trade.price
        }
    }
    getSymbolGreeks(symbol: string): IGreeksRawData | undefined {
        const greeks = this.greeks[symbol];

        if(!greeks) {
            return undefined;
        }

        return {
            delta: greeks.delta,
            volatility: greeks.volatility,
            theta: greeks.theta,
            gamma: greeks.gamma,
            vega: greeks.vega,
            rho: greeks.rho,
            time: greeks.time
        }
    }

    async getPlatformWatchLists(): Promise<IWatchListRawData[]> {
        const result = await this.tastyClient.watchlistsService.getPublicWatchlists();

        return result.map((wl: any) => {
            return {
                name: wl.name,
                entries: wl["watchlist-entries"].map((e: any) => e.symbol)
            }
        })
    }
    async getSymbolMetrics(symbol: string): Promise<ISymbolMetricsRawData | null> {
        const result = await this.tastyClient.marketMetricsService.getMarketMetrics({symbols: symbol});

        if(!Check.isArray(result) || result.length === 0) {
            return null;
        }

        const data = result[0] as any;

        const earningsRawData = data["earnings"];

        let earnings: ISymbolEarningsRawData | undefined;

        if(earningsRawData) {
            earnings = {
                expectedReportDate: earningsRawData["expected-report-date"],
                actualEarningsPerShare: earningsRawData["actual-eps"],
            }
        }
        return {
            beta: data["beta"],
            impliedVolatilityPercentile: data["implied-volatility-percentile"],
            liquidityRank: data["liquidity-rank"],
            impliedVolatilityIndex: data["implied-volatility-index"],
            impliedVolatilityIndexRank: data["implied-volatility-index-rank"],
            earnings: earnings
        }
    }

    async getSymbolInfo(symbol: string): Promise<ISymbolInfoRawData> {
        const response = await this.tastyClient.instrumentsService.getSingleEquity(symbol);
        return {
            listedMarket: response['listed-market'],
            description: response['description']
        }
    }
    async searchSymbol(query: string): Promise<ISearchSymbolItemRawData[]> {
        const result: any[] = (await this.tastyClient.symbolSearchService.getSymbolData(query)) ?? [];

        return result.map((r: any) => {
            return {
                symbol: r.symbol,
                description: r.description,
            }
        })
    }

    private _subscribeToSymbols(symbols: string[], tastyClient: TastyTradeClient): void {
        symbols = symbols.filter(s => Boolean(s));

        if(symbols.length === 0) {
            return;
        }
        tastyClient.quoteStreamer.subscribe(symbols, [
            MarketDataSubscriptionType.Quote,
            MarketDataSubscriptionType.Trade,
            //MarketDataSubscriptionType.Summary,
            //MarketDataSubscriptionType.Profile,
            MarketDataSubscriptionType.Greeks,
            //MarketDataSubscriptionType.Underlying
        ]);
    }

    private _unsubscribeFromSymbols(symbols: string[], tastyClient: TastyTradeClient, excludeSymbols: string[]): void {

        const symbolsToUnsubscribe = symbols.filter(s => !excludeSymbols.includes(s));
        if(symbolsToUnsubscribe.length > 0) {
            tastyClient.quoteStreamer.unsubscribe(symbolsToUnsubscribe);
        }


    }

}