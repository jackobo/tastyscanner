import {reaction} from "mobx";
import {
    IGreeksRawData,
    IOptionChainRawData,
    IMarketDataProviderService,
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
import {IBroker} from "../interfaces/broker.interface";
import {IBrokerageAccountModel} from "../interfaces/brokerage-account.view-model.interface";
import {TastyMarketDataProvider} from "./tasty-market-data-provider";


export class TastyBroker implements IBroker, IMarketDataProviderService {
    constructor(private readonly services: IAppServiceFactory) {

        this._connectToTastyPromise = new Promise((resolve) => {
            this._connectToTastyPromiseResolver = resolve;
        })


        reaction(() => this.services.appSettings.currentSettings, async (appSettings) => {
            if(this._currentTastyClient) {
                this._tastyMarketDataProvider?.disconnect();
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
    private _tastyMarketDataProvider: TastyMarketDataProvider | undefined = undefined;


    private _connectToTastyPromise: Promise<TastyTradeClient>;
    private _connectToTastyPromiseResolver: null | ((value: TastyTradeClient | PromiseLike<TastyTradeClient>) => void) = null;


    private async _connectToTasty(appSettings: IAppSettingsFields | null): Promise<TastyTradeClient | null> {


        const config = await this._createTastyClientConfig(appSettings);
        if(!config) {
            return null;
        }

        const tastyClient = new TastyTradeClient(config);

        if(Check.isNullOrUndefined(await this._connectToAccountStreamer(tastyClient))) {
            return null;
        }


        if(Check.isNullOrUndefined(await this._connectToQuoteStreamer(tastyClient))) {
            return null;
        }




        if(this._connectToTastyPromiseResolver) {
            this._connectToTastyPromiseResolver(tastyClient);
        }


        return tastyClient;

    }

    private async _connectToQuoteStreamer(tastyClient: TastyTradeClient): Promise<TastyTradeClient | null> {
        try {

            const marketDataProvider = new TastyMarketDataProvider(tastyClient);
            await marketDataProvider.connect();
            this._tastyMarketDataProvider = marketDataProvider;
            return tastyClient;

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

    private async _executeMarketProviderApi<TResult>(apiCall: (marketDataProvider: TastyMarketDataProvider) => Promise<TResult>): Promise<TResult> {
        try {
            await this.waitForConnection();
            if(this._tastyMarketDataProvider) {
                return await apiCall(this._tastyMarketDataProvider);
            }

        } catch (err) {
            await this.services.toaster.showErrorToast({
                renderContent: () => this.services.language.translate("Failed to call Tasty API. Please check your network connection or your credentials in the app settings.")
            });
            throw err;
        }

        throw new Error("Market data provider is not connected");
    }

    getSymbolTrade(symbol: string): ITradeRawData | undefined {
        return this._tastyMarketDataProvider?.getSymbolTrade(symbol);
    }

    getSymbolQuote(symbol: string): IQuoteRawData | undefined {
        return this._tastyMarketDataProvider?.getSymbolQuote(symbol);
    }

    getSymbolGreeks(symbol: string): IGreeksRawData | undefined {
        return this._tastyMarketDataProvider?.getSymbolGreeks(symbol);
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

    subscribe(symbols: string[]): void {
        this._executeMarketProviderApi(async (marketDataProvider) => {
            marketDataProvider.subscribe(symbols);
        })
    }


    subscribeForOpenPositions(symbols: string[]): void {
        this._executeMarketProviderApi(async (marketDataProvider) => {
            marketDataProvider.subscribeForOpenPositions(symbols);
        });
    }



    unsubscribe(symbols: string[]): void {
        this._executeMarketProviderApi(async (marketDataProvider) => {
            marketDataProvider.unsubscribe(symbols);
        });

    }

    unsubscribeForOpenPositions(symbols: string[]): void {
        this._executeMarketProviderApi(async (marketDataProvider) => {
            marketDataProvider.unsubscribeForOpenPositions(symbols);
        });
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

    async getAccounts(): Promise<IBrokerageAccountModel[]> {
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