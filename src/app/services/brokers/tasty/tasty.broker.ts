import {makeObservable, observable, reaction, runInAction} from "mobx";
import {
    IGreeksRawData,
    IOptionChainRawData,
    IMarketDataProviderService,
    IQuoteRawData,
    ITradeRawData,
    IWatchListRawData,
    ISymbolMetricsRawData,
    ISymbolEarningsRawData,
    ISymbolInfoRawData,
    ISearchSymbolItemRawData
} from "../../market-data-provider/market-data-provider.service.interface";
import TastyTradeClient, {MarketDataSubscriptionType, STREAMER_STATE} from "@tastytrade/api"
import {Check} from "../../../../framework/utils/type-checking";
import {IAppServiceFactory} from "../../app-service-factory.interface";
import {IAppSettingsFields} from "../../app-settings/app-settings.service.interface";
import {ITastyAccountRawData} from "./raw-data/tasty-account-raw-data.interfaces";
import {TastyAccountModel} from "./tasty-account.model";
import {IBroker} from "../interfaces/broker.interface";
import {IBrokerageAccountViewModel} from "../interfaces/brokerage-account.view-model.interface";




export class TastyBroker implements IBroker, IMarketDataProviderService {
    constructor(private readonly services: IAppServiceFactory) {

        this._connectToTastyPromise = new Promise((resolve) => {
            this._connectToTastyPromiseResolver = resolve;
        })

        makeObservable(this, {
            quotes: observable,
            trades: observable,
            greeks: observable,
        });


        reaction(() => this.services.appSettings.currentSettings, async (appSettings) => {
            if(this._currentTastyClient) {
                this._currentTastyClient.quoteStreamer.removeEventListener(this._streamEventHandler);
                this._currentTastyClient.quoteStreamer.disconnect();
                this._currentTastyClient.session.clear();
                this._connectToTastyPromise = new Promise((resolve) => {
                    this._connectToTastyPromiseResolver = resolve;
                });
            }

            this._currentTastyClient = await this._connectToTasty(appSettings);

        }, {
            fireImmediately: true
        })

    }

    get name(): string {
        return "Tasty";
    }

    private _currentTastyClient: TastyTradeClient | null = null;

    public quotes: Record<string, any> = {};
    public trades: Record<string, any> = {};
    public greeks: Record<string, any> = {};

    private _connectToTastyPromise: Promise<TastyTradeClient>;
    private _connectToTastyPromiseResolver: null | ((value: TastyTradeClient | PromiseLike<TastyTradeClient>) => void) = null;

    private _lastSymbols: string[] = [];

    private async _connectToTasty(appSettings: IAppSettingsFields | null): Promise<TastyTradeClient | null> {


        const config = await this._createTastyClientConfig(appSettings);
        if(!config) {
            return null;
        }

        const tastyClient = new TastyTradeClient(config);

        if(Check.isNullOrUndefined(await this._connectToQuoteStreamer(tastyClient))) {
            return null;
        }

        if(Check.isNullOrUndefined(await this._connectToAccountStreamer(tastyClient))) {
            return null;
        }

        if(this._lastSymbols.length > 0) {
            this._subscribeToSymbols(this._lastSymbols, tastyClient);
        }

        if(this._connectToTastyPromiseResolver) {
            this._connectToTastyPromiseResolver(tastyClient);
        }


        return tastyClient;

    }

    private async _connectToQuoteStreamer(tastyClient: TastyTradeClient): Promise<TastyTradeClient | null> {
        tastyClient.quoteStreamer.addEventListener(this._streamEventHandler);

        try {

            await tastyClient.quoteStreamer.connect();
            return tastyClient;

        } catch(e) {
            tastyClient.quoteStreamer.removeEventListener(this._streamEventHandler);
            await this.services.toaster.showErrorToast({
                renderContent: () => this.services.language.translate("Failed to connect to Tasty API. Please check your credentials in the app settings.")
            });
            return null;
        }
    }

    private async _connectToAccountStreamer(tastyClient: TastyTradeClient): Promise<TastyTradeClient | null> {
        let accountNumbers: string[];
        try {
            accountNumbers = (await this._getAccounts(tastyClient))?.map(acc => acc.accountNumber) ?? [];
            if(accountNumbers.length === 0) {
                return tastyClient;
            }
            const accountStreamer = tastyClient.accountStreamer;
            await accountStreamer.start();
            await accountStreamer.subscribeToAccounts(accountNumbers);
            accountStreamer.addMessageObserver(this._accountStreamerMessageObserver);
            accountStreamer.addStreamerStateObserver(this._accountStreamerStateObserver);
            return tastyClient;
        }
        catch(e) {
            tastyClient.quoteStreamer.removeEventListener(this._streamEventHandler);
            await this.services.toaster.showErrorToast({
                renderContent: () => this.services.language.translate("Failed to read accounts from Tasty API. Please check your network connection or credentials in the app settings.")
            });
            return null;
        }
    }

    private async _createTastyClientConfig(appSettings: IAppSettingsFields | null) {
        const clientSecret = import.meta.env.VITE_CLIENT_SECRET || appSettings?.tastyClientSecret;
        const refreshToken = import.meta.env.VITE_REFRESH_TOKEN || appSettings?.tastyRefreshToken;

        if(!clientSecret || !refreshToken) {
            await this.services.toaster.showErrorToast({
                renderContent: () => this.services.language.translate("Tasty API credentials are not set. Please set them in the app settings.")
            })

            return null;
        }

        return {
            ...TastyTradeClient.ProdConfig,
            clientSecret: clientSecret,
            refreshToken: refreshToken,
            oauthScopes: ['read', 'trade']
        }
    }

    private async _getTastyClient(): Promise<TastyTradeClient> {
        return await this._connectToTastyPromise;
    }


    async waitForConnection(): Promise<void> {
        await this._getTastyClient();
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
            volatility: greeks.volatility,
            theta: greeks.theta,
            gamma: greeks.gamma,
            vega: greeks.vega,
            rho: greeks.rho,
            time: greeks.time

        }
    }


    private async _executeTastyApi<TResult>(apiCall: (tastyClient: TastyTradeClient) => Promise<TResult>): Promise<TResult> {
        try {
            const tastyClient = await this._getTastyClient();
            return await apiCall(tastyClient);
        } catch (err) {
            await this.services.toaster.showErrorToast({
                renderContent: () => this.services.language.translate("Failed to call Tasty API. Please check your network connection or your credentials in the app settings.")
            });
            throw err;
        }


    }

    async getSymbolInfo(symbol: string): Promise<ISymbolInfoRawData> {
        return await this._executeTastyApi(async (tastyClient) => {
            const response = await tastyClient.instrumentsService.getSingleEquity(symbol);
            return {
                listedMarket: response['listed-market'],
                description: response['description']
            }
        })
    }

    /*
        {
    "id": 7824,
    "active": true,
    "borrow-rate": "0.0",
    "bypass-manual-review": false,
    "country-of-incorporation": "US",
    "country-of-taxation": "USA",
    "cusip": "02079K305",
    "description": "ALPHABET INC CLASS A COMMON STOCK",
    "instrument-type": "Equity",
    "is-closing-only": false,
    "is-etf": false,
    "is-fractional-quantity-eligible": true,
    "is-fraud-risk": false,
    "is-illiquid": false,
    "is-index": false,
    "is-options-closing-only": false,
    "lendability": "Easy To Borrow",
    "listed-market": "XNAS",
    "market-time-instrument-collection": "Equity",
    "overnight-trading-permitted": true,
    "short-description": "ALPHABET INC",
    "streamer-symbol": "GOOGL",
    "symbol": "GOOGL",
    "option-tick-sizes": [
        {
            "threshold": "3.0",
            "value": "0.01"
        },
        {
            "value": "0.05"
        }
    ],
    "tick-sizes": [
        {
            "threshold": "1.0",
            "value": "0.0001"
        },
        {
            "value": "0.01"
        }
    ]
}
         */


    async getOptionsChain(symbol: string): Promise<IOptionChainRawData[]> {

        return await this._executeTastyApi(async (tastyClient) => {
            const optionsChain = await tastyClient.instrumentsService.getNestedOptionChain(symbol);
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
        })


    }

    subscribe(symbols: string[]): void {
        this._executeTastyApi(async (tastyClient) => {
            this._subscribeToSymbols(symbols, tastyClient)
        })
    }

    private _subscribeToSymbols(symbols: string[], tastyClient: TastyTradeClient): void {
        tastyClient.quoteStreamer.subscribe(symbols, [
            MarketDataSubscriptionType.Quote,
            MarketDataSubscriptionType.Trade,
            //MarketDataSubscriptionType.Summary,
            //MarketDataSubscriptionType.Profile,
            MarketDataSubscriptionType.Greeks,
            //MarketDataSubscriptionType.Underlying
        ]);

        this._lastSymbols = symbols;
    }

    unsubscribe(symbols: string[]): void {
        if(symbols.length === 0) {
            return;
        }

        this._executeTastyApi(async (tastyClient) => {
            tastyClient.quoteStreamer.unsubscribe(symbols);
        });

        this._lastSymbols = this._lastSymbols.filter(s => !symbols.includes(s));

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

    private _accountStreamerMessageObserver = (json: object) => {
        //console.log("messageObserver", json);
    }

    private _accountStreamerStateObserver = (streamerState: STREAMER_STATE) => {
        //console.log("streamer state", streamerState);
    }


    async getUserWatchLists(): Promise<IWatchListRawData[]> {
        return await this._executeTastyApi(async (tastyClient) => {
            const result = await tastyClient.watchlistsService.getAllWatchlists();
            return result.map((wl: any) => {
                return {
                    name: wl.name,
                    entries: wl["watchlist-entries"].map((e: any) => e.symbol)
                }
            })
        })

    }
    async getPlatformWatchLists(): Promise<IWatchListRawData[]> {
        return await this._executeTastyApi(async (tastyClient) => {
            const result = await tastyClient.watchlistsService.getPublicWatchlists();

            return result.map((wl: any) => {
                return {
                    name: wl.name,
                    entries: wl["watchlist-entries"].map((e: any) => e.symbol)
                }
            })
        })


    }

    async getSymbolMetrics(symbol: string): Promise<ISymbolMetricsRawData | null> {

        return await this._executeTastyApi(async (tastyClient) => {
            const result = await tastyClient.marketMetricsService.getMarketMetrics({symbols: symbol});

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
        })



        /*
    "implied-volatility-percentile": 0,
    "liquidity-rank": 0,
    "option-expiration-implied-volatilities": [
        {
            "expiration-date": "2025-12-31T11:30:50.667Z",
            "settlement-type": "string",
            "option-chain-type": "string",
            "implied-volatility": 0
        }
    ],
    "implied-volatility-rank": 0,
    "implied-volatility-index": 0,
    "liquidity": 0,
    "implied-volatility-index-5-day-change": 0,
    "symbol": "string",
    "liquidity-rating": 0

     */
    }

    async searchSymbol(query: string): Promise<ISearchSymbolItemRawData[]> {

        return await this._executeTastyApi(async (tastyClient) => {
            const result: any[] = (await tastyClient.symbolSearchService.getSymbolData(query)) ?? [];

            return result.map((r: any) => {
                return {
                    symbol: r.symbol,
                    description: r.description,
                }
            })
        })
    }

    async getAccounts(): Promise<IBrokerageAccountViewModel[]> {
        return await this._executeTastyApi(async (tastyClient) => {
           return (await this._getAccounts(tastyClient)).map(acc => new TastyAccountModel(acc, tastyClient, this.services));
        })
    }

    private async _getAccounts(tastyClient: TastyTradeClient): Promise<ITastyAccountRawData[]> {
        const accounts: any[] = await tastyClient.accountsAndCustomersService.getCustomerAccounts()
        return accounts.map(acc => {
            return {
                accountNumber: acc.account["account-number"]
            }
        });
    }

}