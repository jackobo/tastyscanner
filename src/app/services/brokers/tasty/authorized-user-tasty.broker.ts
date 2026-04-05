import {makeObservable, observable, reaction, runInAction} from "mobx";
import {
    IGreeksRawData,
    IOptionChainRawData,
    IQuoteRawData,
    ITradeRawData,
    IWatchListRawData,
    ISymbolMetricsRawData,
    ISymbolInfoRawData,
    ISearchSymbolItemRawData
} from "../../market-data-provider/market-data-provider.service.interface";
import TastyTradeClient, {STREAMER_STATE} from "@tastytrade/api"
import {Check} from "../../../../framework/utils/type-checking";
import {IAppServiceFactory} from "../../app-service-factory.interface";
import {IAppSettingsFields} from "../../app-settings/app-settings.service.interface";
import {ITastyAccountRawData} from "./raw-data/tasty-account.raw-data.interfaces";
import {TastyAccountModel} from "./tasty-account.model";
import {TastyMarketDataProvider} from "./tasty-market-data-provider";
import {NullableUndefinedString} from "../../../../framework/types/nullable-types";
import {TastyOrdersReader} from "./orders/tasty-orders-reader";
import {ITastyBroker} from "./tasty-broker.interface";

class TastyConnection {
    constructor(public readonly tastyClient: TastyTradeClient,
                public readonly marketDataProvider: TastyMarketDataProvider) {
    }

}

export class AuthorizedUserTastyBroker implements ITastyBroker {

    constructor(private readonly services: IAppServiceFactory) {
        this._connectToTastyPromise = new Promise((resolve) => {
            this._connectToTastyPromiseResolver = resolve;
            //this._connectToTastyPromiseRejecter = reject;
        });

        makeObservable<this, '_currentTastyConnection' | '_accounts'>(this, {
            _currentTastyConnection: observable.ref,
            _accounts: observable.ref,
        })

        reaction(() => this.services.appSettings.currentSettings, async (appSettings) => {
            this.dispose();

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
    //private _connectToTastyPromiseRejecter: null | ((reason?: any) => void) = null;
    private _currentTastyConnection: TastyConnection | null = null;
    private _accountStreamerDisposers: Array<() => void> = [];

    dispose(): void {
        if(this._currentTastyConnection) {
            this._accountStreamerDisposers.forEach(d => d());
            this._accountStreamerDisposers = [];
            this._currentTastyConnection.marketDataProvider.dispose();
            this._currentTastyConnection.tastyClient.session.clear();
            this._connectToTastyPromise = new Promise((resolve) => {
                this._connectToTastyPromiseResolver = resolve;
            });
        }
    }

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
            this._connectToTastyPromiseResolver(tastyConnection);
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

    private _accountStreamerMessageObserver = async (json: any) => {
        if(json?.action !== 'heartbeat') {
            console.log("messageObserver", json);
        }


        switch (json?.type) {
            case 'AccountBalance':
                if(json.data) {
                    const account = this._findAccount(json.data['account-number']);
                    account?.accountInfo?.updateInfo(json.data);

                }
                break;
            case 'Order':
                if(json.data) {
                    const rawOrderData = TastyOrdersReader.mapRawOrderData(json.data);
                    const account = this._findAccount(rawOrderData.accountNumber);
                    if(account) {
                        await account.updateOrder(rawOrderData);
                    }
                }
                break;

        }
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

    async getSymbolMetrics(symbol: string): Promise<ISymbolMetricsRawData> {
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