import { makeObservable, observable, runInAction } from "mobx";
import {
    IGreeksRawData,
    IOptionChainRawData,
    IMarketDataProviderService,
    IQuoteRawData,
    ITradeRawData, IWatchListRawData
} from "./market-data-provider.service.interface";
import TastyTradeClient, {MarketDataSubscriptionType} from "@tastytrade/api"

export class TastyMarketDataProvider implements IMarketDataProviderService {
    constructor() {
        this._tastyClient = new TastyTradeClient({
            ...TastyTradeClient.ProdConfig,
            clientSecret: import.meta.env.VITE_CLIENT_SECRET,
            refreshToken: import.meta.env.VITE_REFRESH_TOKEN,
            oauthScopes: ['read']
        });
        this._tastyClient.quoteStreamer.addEventListener(this._streamEventHandler);

        makeObservable(this, {
            quotes: observable,
            trades: observable,
            greeks: observable,
        });
    }

    public quotes: Record<string, any> = {};
    public trades: Record<string, any> = {};
    public greeks: Record<string, any> = {};

    async start(): Promise<void> {
        await this._tastyClient.quoteStreamer.connect();
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

    getSymbolGreeks(symbol: string): IGreeksRawData | undefined {
        const greeks = this.greeks[symbol];

        if(!greeks) {
            return undefined;
        }

        return {
            delta: greeks.delta,
        }
    }



    private _tastyClient: TastyTradeClient;
    async getOptionsChain(symbol: string): Promise<IOptionChainRawData[]> {
        const optionsChain = await this._tastyClient.instrumentsService.getNestedOptionChain(symbol);
        const result: IOptionChainRawData[] = [];
        for(const optionChain of optionsChain) {
            result.push({
                expirations: optionChain.expirations.map((expiration: any) => {
                    return {
                        expirationDate: expiration["expiration-date"],
                        daysToExpiration: expiration["days-to-expiration"],
                        expirationType: expiration["expiration-type"],
                        strikes: expiration["strikes"]?.map((strike: any) => {

                            return {
                                strikePrice: parseFloat(strike["strike-price"]),
                                callStreamerSymbol: strike["call-streamer-symbol"],
                                putStreamerSymbol: strike["put-streamer-symbol"]
                            }
                        }) ?? []
                    }
                })
            });
        }

        return result;
    }

    subscribe(symbols: string[]): void {
        this._tastyClient.quoteStreamer.subscribe(symbols, [
            MarketDataSubscriptionType.Quote,
            MarketDataSubscriptionType.Trade,
            //MarketDataSubscriptionType.Summary,
            //MarketDataSubscriptionType.Profile,
            MarketDataSubscriptionType.Greeks,
            //MarketDataSubscriptionType.Underlying
        ]);


    }

    unsubscribe(symbols: string[]): void {
        if(symbols.length === 0) {
            return;
        }
        this._tastyClient.quoteStreamer.unsubscribe(symbols);
        /*
        runInAction(() => {
            for(const symbol of symbols) {
                delete this.quotes[symbol];
                delete this.trades[symbol];
                delete this.greeks[symbol];
            }
        });

         */

    }

    private _streamEventHandler= (records: any[]) => {
        runInAction(() => {
            for(const record of records) {
                
                if(record.eventType === "Quote") {
                    //console.log(record);
                    this.quotes[record.eventSymbol] = record;
                } else if(record.eventType === "Trade") {
                    this.trades[record.eventSymbol] = record;
                } else if(record.eventType === "Greeks") {
                    this.greeks[record.eventSymbol] = record;
                }

            }
        })
    }


    async getUserWatchLists(): Promise<IWatchListRawData[]> {
        const result = await this._tastyClient.watchlistsService.getAllWatchlists();
        return result.map((wl: any) => {
            return {
                name: wl.name,
                entries: wl["watchlist-entries"].map(e => e.symbol)
            }
        })
    }
    async getPlatformWatchLists(): Promise<IWatchListRawData[]> {
        const result = await this._tastyClient.watchlistsService.getPublicWatchlists();

        return result.map((wl: any) => {
            return {
                name: wl.name,
                entries: wl["watchlist-entries"].map(e => e.symbol)
            }
        })

    }

}