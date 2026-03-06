import {makeObservable, observable, reaction, runInAction} from "mobx";
import {
    IGreeksRawData,
    IOptionChainRawData,
    IQuoteRawData,
    ITradeRawData,
    IWatchListRawData,
    ISymbolMetricsRawData,
    ISymbolInfoRawData,
    ISearchSymbolItemRawData, IMarketDataProvider
} from "../../market-data-provider/market-data-provider.service.interface";
import TastyTradeClient, {STREAMER_STATE} from "@tastytrade/api"
import {Check} from "../../../../framework/utils/type-checking";
import {IAppServiceFactory} from "../../app-service-factory.interface";
import {IAppSettingsFields} from "../../app-settings/app-settings.service.interface";
import {ITastyAccountRawData} from "./raw-data/tasty-account.raw-data.interfaces";
import {TastyAccountModel} from "./tasty-account.model";
import {IBroker} from "../interfaces/broker.interface";
import {TastyMarketDataProvider} from "./tasty-market-data-provider";
import {NullableUndefinedString} from "../../../../framework/types/nullable-types";

class TastyConnection {
    constructor(public readonly tastyClient: TastyTradeClient,
                public readonly marketDataProvider: TastyMarketDataProvider) {
    }

}

export class TastyBroker implements IBroker, IMarketDataProvider {

    constructor(private readonly services: IAppServiceFactory) {

        this._connectToTastyPromise = new Promise((resolve) => {
            this._connectToTastyPromiseResolver = resolve;
        });

        makeObservable<this, '_currentTastyConnection' | '_accounts'>(this, {
            _currentTastyConnection: observable.ref,
            _accounts: observable.ref,
        })

        reaction(() => this.services.appSettings.currentSettings, async (appSettings) => {
            if(this._currentTastyConnection) {
                this._accountStreamerDisposers.forEach(d => d());
                this._accountStreamerDisposers = [];
                this._currentTastyConnection.marketDataProvider.disconnect();
                this._currentTastyConnection.tastyClient.session.clear();
                this._connectToTastyPromise = new Promise((resolve) => {
                    this._connectToTastyPromiseResolver = resolve;
                });
            }

            const cnn = await this._connectToTasty(appSettings);
            runInAction(() => {
                this._currentTastyConnection = cnn;
            });
        }, {
            fireImmediately: true
        })

    }

    get name(): string {
        return "Tasty";
    }



    private _connectToTastyPromise: Promise<TastyConnection>;
    private _connectToTastyPromiseResolver: null | ((value: TastyConnection | PromiseLike<TastyConnection>) => void) = null;
    private _currentTastyConnection: TastyConnection | null = null;
    private _accountStreamerDisposers: Array<() => void> = [];


    private async _connectToTasty(appSettings: IAppSettingsFields | null): Promise<TastyConnection | null> {


        const config = await this._createTastyClientConfig(appSettings);
        if(!config) {
            return null;
        }

        const tastyClient = new TastyTradeClient(config);

        if(Check.isNullOrUndefined(await this._connectToAccountStreamer(tastyClient))) {
            return null;
        }

        const marketDataProvider = await this._createMarketDataProvider(tastyClient);

        if(Check.isNullOrUndefined(marketDataProvider)) {
            return null;
        }

        const tastyConnection = new TastyConnection(tastyClient, marketDataProvider);

        if(this._connectToTastyPromiseResolver) {
            this._connectToTastyPromiseResolver(new TastyConnection(tastyClient, marketDataProvider));
        }

        return tastyConnection;

    }

    private async _createMarketDataProvider(tastyClient: TastyTradeClient): Promise<TastyMarketDataProvider | null> {
        try {

            const marketDataProvider = new TastyMarketDataProvider(tastyClient);
            await marketDataProvider.connect();
            return marketDataProvider;

        } catch(e) {
            await this.services.toaster.showErrorToast({
                renderContent: () => this.services.language.translate("Failed to connect to Tasty API. Please check your credentials in the app settings.")
            });
            return null;
        }
    }

    private async _connectToAccountStreamer(tastyClient: TastyTradeClient): Promise<TastyTradeClient | null> {
        let accountNumbers: string[];
        try {
            accountNumbers = (await this._loadAccounts(tastyClient)).map(acc => acc.accountNumber);
            if(accountNumbers.length === 0) {
                return tastyClient;
            }
            const accountStreamer = tastyClient.accountStreamer;
            await accountStreamer.start();
            await accountStreamer.subscribeToAccounts(accountNumbers);
            //console.log("subscribeResult", subscribeResult);
            this._accountStreamerDisposers.push(accountStreamer.addMessageObserver(this._accountStreamerMessageObserver));
            this._accountStreamerDisposers.push(accountStreamer.addStreamerStateObserver(this._accountStreamerStateObserver));
            return tastyClient;
        }
        catch(e) {
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

    private async _getTastyConnection(): Promise<TastyConnection> {
        return await this._connectToTastyPromise;
    }

    async waitForAccountsLoading(): Promise<void> {
        await this._getTastyConnection();
    }


    private async _executeTastyApi<TResult>(apiCall: (tastyClient: TastyTradeClient) => Promise<TResult>): Promise<TResult> {
        try {
            const tastyConnection = await this._getTastyConnection();
            return await apiCall(tastyConnection.tastyClient);
        } catch (err) {
            await this.services.toaster.showErrorToast({
                renderContent: () => this.services.language.translate("Failed to call Tasty API. Please check your network connection or your credentials in the app settings.")
            });
            throw err;
        }
    }

    private async _executeMarketProviderApi<TResult>(apiCall: (marketDataProvider: TastyMarketDataProvider) => Promise<TResult>): Promise<TResult> {
        try {
            const tastyConnection = await this._getTastyConnection();
            return await apiCall(tastyConnection.marketDataProvider);
        } catch (err) {
            await this.services.toaster.showErrorToast({
                renderContent: () => this.services.language.translate("Failed to call Tasty API. Please check your network connection or your credentials in the app settings.")
            });
            throw err;
        }
    }

    getSymbolTrade(symbol: string): ITradeRawData | undefined {
        return this._currentTastyConnection?.marketDataProvider?.getSymbolTrade(symbol);
    }

    getSymbolQuote(symbol: string): IQuoteRawData | undefined {
        return this._currentTastyConnection?.marketDataProvider?.getSymbolQuote(symbol);
    }

    getSymbolGreeks(symbol: string): IGreeksRawData | undefined {
        return this._currentTastyConnection?.marketDataProvider?.getSymbolGreeks(symbol);
    }


    async getSymbolInfo(symbol: string): Promise<ISymbolInfoRawData> {
        return await this._executeMarketProviderApi(async (marketDataProvider) => {
            return marketDataProvider.getSymbolInfo(symbol);
        })
    }

    async getOptionsChain(symbol: string): Promise<IOptionChainRawData[]> {

        return this._executeMarketProviderApi(async (marketDataProvider) => {
            return marketDataProvider.getOptionsChain(symbol);
        })
    }

    subscribeToStreamer(symbols: string[]): void {
        this._executeMarketProviderApi(async (marketDataProvider) => {
            marketDataProvider.subscribeToStreamer(symbols);
        })
    }



    unsubscribeFromStreamer(symbols: string[]): void {
        this._executeMarketProviderApi(async (marketDataProvider) => {
            marketDataProvider.unsubscribeFromStreamer(symbols);
        });
    }

    private _findAccount(accountNumber: NullableUndefinedString): TastyAccountModel | null {
        return (this._accounts ?? []).find(acc => acc.accountNumber === accountNumber) ?? null;
    }

    private _accountStreamerMessageObserver = (json: any) => {
        if(json?.action !== 'heartbeat') {
            console.log("messageObserver", json);
        }


        switch (json?.type) {
            case 'AccountBalance':
                if(json.data) {
                    const account = this._findAccount(json.data['account-number']);
                    account?.accountInfo?.updateInfo(json.data);

                }

        }

        /*

        //order placed
        {
            "type": "Order",
            "data": {
                "id": 444756436,
                "account-number": "5WZ51885",
                "cancellable": true,
                "editable": true,
                "edited": false,
                "global-request-id": "986c01bad01ecd09d68132ed72133efb",
                "order-type": "Limit",
                "price": "2.1",
                "price-effect": "Credit",
                "received-at": "2026-03-05T23:33:26.190+00:00",
                "size": 1,
                "source": "desktop-javafx;2.44.0",
                "status": "Received",
                "time-in-force": "GTC",
                "underlying-instrument-type": "Equity",
                "underlying-symbol": "NVDA",
                "updated-at": 1772753606190,
                "legs": [
                    {
                        "action": "Buy to Open",
                        "instrument-type": "Equity Option",
                        "quantity": 1,
                        "remaining-quantity": 1,
                        "symbol": "NVDA  260417C00210000",
                        "fills": []
                    },
                    {
                        "action": "Sell to Open",
                        "instrument-type": "Equity Option",
                        "quantity": 1,
                        "remaining-quantity": 1,
                        "symbol": "NVDA  260417C00200000",
                        "fills": []
                    }
                ]
            },
            "timestamp": 1772753606205,
            "ws-sequence": 0
        }
         */

        /*
        //order canceled
        {
            "id": 444756436,
            "account-number": "5WZ51885",
            "cancellable": false,
            "cancelled-at": "2026-03-05T23:34:13.367+00:00",
            "editable": false,
            "edited": false,
            "global-request-id": "986c01bad01ecd09d68132ed72133efb",
            "order-type": "Limit",
            "price": "2.1",
            "price-effect": "Credit",
            "received-at": "2026-03-05T23:33:26.190+00:00",
            "size": 1,
            "source": "desktop-javafx;2.44.0",
            "status": "Cancelled",
            "terminal-at": "2026-03-05T23:34:13.367+00:00",
            "time-in-force": "GTC",
            "underlying-instrument-type": "Equity",
            "underlying-symbol": "NVDA",
            "updated-at": 1772753653374,
            "legs": [
                {
                    "action": "Buy to Open",
                    "instrument-type": "Equity Option",
                    "quantity": 1,
                    "remaining-quantity": 1,
                    "symbol": "NVDA  260417C00210000",
                    "fills": []
                },
                {
                    "action": "Sell to Open",
                    "instrument-type": "Equity Option",
                    "quantity": 1,
                    "remaining-quantity": 1,
                    "symbol": "NVDA  260417C00200000",
                    "fills": []
                }
            ]
        }

        */

        /*
        //account balance
        {
                "type": "AccountBalance",
                "data": {
                    "account-number": "5WZ51885",
                    "available-trading-funds": "0.0",
                    "bond-margin-requirement": "0.0",
                    "cash-available-to-withdraw": "22216.6",
                    "cash-balance": "44178.164",
                    "cash-settle-balance": "22216.6",
                    "closed-loop-available-balance": "22216.6",
                    "cryptocurrency-margin-requirement": "0.0",
                    "currency": "USD",
                    "day-equity-call-value": "0.0",
                    "day-trade-excess": "22216.6",
                    "day-trading-buying-power": "0.0",
                    "day-trading-call-value": "0.0",
                    "derivative-buying-power": "12488.164",
                    "equity-buying-power": "24976.328",
                    "equity-offering-margin-requirement": "0.0",
                    "fixed-income-security-margin-requirement": "0.0",
                    "futures-margin-requirement": "0.0",
                    "intraday-equities-cash-amount": "3638.614",
                    "intraday-equities-cash-effect": "Debit",
                    "intraday-equities-cash-effective-date": "2026-03-05",
                    "intraday-futures-cash-amount": "475.98",
                    "intraday-futures-cash-effect": "Debit",
                    "intraday-futures-cash-effective-date": "2026-01-21",
                    "long-bond-value": "0.0",
                    "long-cryptocurrency-value": "0.0",
                    "long-derivative-value": "58680.0",
                    "long-equity-value": "0.0",
                    "long-fixed-income-security-value": "0.0",
                    "long-futures-derivative-value": "0.0",
                    "long-futures-value": "0.0",
                    "long-margineable-value": "0.0",
                    "maintenance-call-value": "0.0",
                    "maintenance-requirement": "31900.0",
                    "margin-equity": "44178.164",
                    "margin-settle-balance": "48098.6",
                    "net-liquidating-value": "41419.164",
                    "pending-cash": "0.0",
                    "pending-cash-effect": "None",
                    "previous-day-cryptocurrency-fiat-amount": "0.0",
                    "previous-day-cryptocurrency-fiat-effect": "None",
                    "reg-t-call-value": "0.0",
                    "short-cryptocurrency-value": "0.0",
                    "short-derivative-value": "61439.0",
                    "short-equity-value": "0.0",
                    "short-futures-derivative-value": "0.0",
                    "short-futures-value": "0.0",
                    "short-margineable-value": "0.0",
                    "sma-equity-option-buying-power": "14893.014",
                    "special-memorandum-account-apex-adjustment": "2404.85",
                    "special-memorandum-account-value": "13278.16",
                    "total-settle-balance": "48098.6",
                    "unsettled-cryptocurrency-fiat-amount": "0.0",
                    "unsettled-cryptocurrency-fiat-effect": "None",
                    "used-derivative-buying-power": "28956.0",
                    "snapshot-date": "2026-03-05",
                    "reg-t-margin-requirement": "31900.0",
                    "futures-overnight-margin-requirement": "0.0",
                    "futures-intraday-margin-requirement": "0.0",
                    "maintenance-excess": "12488.164",
                    "pending-margin-interest": "0.0",
                    "apex-starting-day-margin-equity": "47816.6",
                    "buying-power-adjustment": "0.0",
                    "buying-power-adjustment-effect": "None",
                    "effective-cryptocurrency-buying-power": "12488.164",
                    "total-pending-liquidity-pool-rebate": "0.0",
                    "long-index-derivative-value": "34745.0",
                    "short-index-derivative-value": "36230.0",
                    "updated-at": "2026-03-05T23:41:52.986+00:00"
                },
                "timestamp": 1772754109941,
                "ws-sequence": 1
            }

        */

    }

    private _accountStreamerStateObserver = (streamerState: STREAMER_STATE) => {
        console.log("streamer state", streamerState);
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
        return this._executeMarketProviderApi(async (marketDataProvider) => {
            return await marketDataProvider.getPlatformWatchLists();
        });

    }

    async getSymbolMetrics(symbol: string): Promise<ISymbolMetricsRawData | null> {
        return await this._executeMarketProviderApi(async (marketDataProvider) => {
            return marketDataProvider.getSymbolMetrics(symbol);
        });
    }

    async searchSymbol(query: string): Promise<ISearchSymbolItemRawData[]> {
        return await this._executeMarketProviderApi(async (marketDataProvider) => {
            return marketDataProvider.searchSymbol(query);
        });
    }


    private _accounts: TastyAccountModel[] | null = null;

    get accounts(): TastyAccountModel[] {
        return this._accounts ?? [];
    }

    private async _loadAccounts(tastyClient: TastyTradeClient): Promise<TastyAccountModel[]> {
        const rawAccounts: any[] = (await tastyClient.accountsAndCustomersService.getCustomerAccounts() ?? []);
        const accountsModels = rawAccounts.map(acc => {
            const rawAccountData: ITastyAccountRawData = {
                accountNumber: acc.account["account-number"]
            };

            return new TastyAccountModel(rawAccountData, tastyClient, this.services);

        });

        runInAction(() => {
            this._accounts = accountsModels;
        })

        return accountsModels;
    }

}