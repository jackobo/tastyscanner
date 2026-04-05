import TastyTradeClient, {MarketDataSubscriptionType} from "@tastytrade/api";
import {
    IGreeksRawData,
    IMarketDataProviderService,
    IOptionChainRawData,
    IQuoteRawData,
    ISearchSymbolItemRawData, ISymbolEarningsRawData,
    ISymbolInfoRawData,
    ISymbolMetricsRawData, ITickSizeRawData,
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

    private _streamerSubscriptionsCount: Record<string, number> = {};

    dispose(): void {
        this.tastyClient.quoteStreamer.removeEventListener(this._streamEventHandler);
        this.tastyClient.quoteStreamer.disconnect();
    }


    public async connect(): Promise<void> {
        this.tastyClient.quoteStreamer.addEventListener(this._streamEventHandler);

        try {

            await this.tastyClient.quoteStreamer.connect();
            const symbols = Object.keys(this._streamerSubscriptionsCount);
            this._subscribeToSymbols(symbols, this.tastyClient);


        } catch(e) {
            this.tastyClient.quoteStreamer.removeEventListener(this._streamEventHandler);
            throw e;
        }
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

    subscribeToStreamer(symbols: string[]): void {

        symbols = symbols.distinct(s => s);

        const symbolsToSubscribe: string[] = [];

        for(const symbol of symbols) {
            if(this._streamerSubscriptionsCount[symbol]) {
                this._streamerSubscriptionsCount[symbol]++;
            } else {
                this._streamerSubscriptionsCount[symbol] = 1;
                symbolsToSubscribe.push(symbol);
            }
        }

        this._subscribeToSymbols(symbolsToSubscribe, this.tastyClient);

    }

    unsubscribeFromStreamer(symbols: string[]): void {
        const symbolsToUnsubscribe: string[] = [];
        for(const symbol of symbols) {
            let symbolSubscriptionsCount = this._streamerSubscriptionsCount[symbol] ?? 0;
            if(symbolSubscriptionsCount === 0) {
                continue;
            }

            symbolSubscriptionsCount--;

            if(symbolSubscriptionsCount === 0) {
                delete this._streamerSubscriptionsCount[symbol];
                symbolsToUnsubscribe.push(symbol);
            } else {
                this._streamerSubscriptionsCount[symbol] = symbolSubscriptionsCount;
            }
        }

        this._unsubscribeFromSymbols(symbolsToUnsubscribe, this.tastyClient);

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
    async getSymbolMetrics(symbol: string): Promise<ISymbolMetricsRawData> {
        const result = await this.tastyClient.marketMetricsService.getMarketMetrics({symbols: symbol});

        if(!Check.isArray(result) || result.length === 0) {
            throw new Error(`No market metrics data for ${symbol} returned from Tasty API`);
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
        const data = await this.tastyClient.instrumentsService.getSingleEquity(symbol);
        return  this._mapSymbolInfo(data);
    }

    private _mapTickSize = (data: any): ITickSizeRawData => {
        return {
            threshold: Check.isNullOrUndefined(data.threshold) ? undefined : parseFloat(data.threshold),
            value: parseFloat(data.value)
        };
    }

    private _mapSymbolInfo(data: any) : ISymbolInfoRawData {
        return {
            //id: data.id,
            active: data.active,
            borrowRate: parseFloat(data["borrow-rate"]),
            bypassManualReview: data["bypass-manual-review"],
            countryOfIncorporation: data["country-of-incorporation"],
            countryOfTaxation: data["country-of-taxation"],
            cusip: data.cusip,
            description: data.description,
            instrumentType: data["instrument-type"],
            isClosingOnly: data["is-closing-only"],
            isEtf: data["is-etf"],
            isFractionalQuantityEligible: data["is-fractional-quantity-eligible"],
            isFraudRisk: data["is-fraud-risk"],
            isIlliquid: data["is-illiquid"],
            isIndex: data["is-index"],
            isOptionsClosingOnly: data["is-options-closing-only"],
            lendability: data.lendability,
            listedMarket: data["listed-market"],
            marketTimeInstrumentCollection: data["market-time-instrument-collection"],
            overnightTradingPermitted: data["overnight-trading-permitted"],
            shortDescription: data["short-description"],
            streamerSymbol: data["streamer-symbol"],
            symbol: data.symbol,
            optionTickSizes: (data["option-tick-sizes"] ?? []).map(this._mapTickSize),
            tickSizes: (data["tick-sizes"] ?? []).map(this._mapTickSize)
        };
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

    private _unsubscribeFromSymbols(symbols: string[], tastyClient: TastyTradeClient): void {

        if(symbols.length > 0) {
            tastyClient.quoteStreamer.unsubscribe(symbols);
        }

    }

}