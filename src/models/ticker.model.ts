import TastyTradeClient, {MarketDataSubscriptionType} from "@tastytrade/api"
import {makeObservable, observable, runInAction} from "mobx";
import {OptionsExpirationModel} from "./options-expiration.model";
import {ITickerViewModel} from "./ticker.view-model.interface";
import {IServiceFactory} from "../services/service-factory.interface";
import {IOptionsExpirationVewModel} from "./options-expiration.view-model.interface";

export class TickerModel implements ITickerViewModel {
    constructor(public readonly symbol: string, public readonly services: IServiceFactory) {
        this._tastyClient = new TastyTradeClient({
            ...TastyTradeClient.ProdConfig,
            clientSecret: import.meta.env.VITE_CLIENT_SECRET,
            refreshToken: import.meta.env.VITE_REFRESH_TOKEN,
            oauthScopes: ['read']
        });

        this._tastyClient.quoteStreamer.addEventListener(this._streamEventHandler);

        makeObservable<this, '_isLoading'>(this, {
            tickerTrade: observable.ref,
            optionsQuotes: observable,
            optionsTrades: observable,
            optionsGreeks: observable,
            expirations: observable,
            _isLoading: observable.ref
        });
    }


    private _tastyClient: TastyTradeClient;
    public tickerTrade: any = {};
    public optionsQuotes: Record<string, unknown> = {};
    public optionsTrades: Record<string, unknown> = {};
    public optionsGreeks: Record<string, unknown> = {};

    public get currentPrice(): number {
        return this.tickerTrade?.price ?? 0;
    }

    public expirations: OptionsExpirationModel[] = [];

    private _isLoading: boolean = true;

    get isLoading(): boolean {
        return this._isLoading;
    }

    set isLoading(value: boolean) {
        runInAction(() => this._isLoading = value);
    }

    private _optionsChains: any = null;
    private async _loadOptionsChain(): Promise<any> {
        if(!this._optionsChains) {
            this._optionsChains = await this._tastyClient.instrumentsService.getNestedOptionChain(this.symbol);

            runInAction(() => {
                for(const optionChain of this._optionsChains) {
                    for(const expiration of optionChain.expirations) {
                        this.expirations.push(new OptionsExpirationModel(expiration, this))
                    }
                }
            })
        }

        return this._optionsChains;
    }

    async start(): Promise<void> {
        this.isLoading = true;
        try {
            await this._loadOptionsChain();

            await this._tastyClient.quoteStreamer.connect();

            const allOptionsSymbols: string[] = [this.symbol];
            for(const expiration of this.expirations) {
                expiration.getAllSymbols().forEach(s => allOptionsSymbols.push(s));
            }

            this._tastyClient.quoteStreamer.subscribe(allOptionsSymbols, [
                MarketDataSubscriptionType.Quote,
                MarketDataSubscriptionType.Trade,
                //MarketDataSubscriptionType.Summary,
                //MarketDataSubscriptionType.Profile,
                MarketDataSubscriptionType.Greeks,
                //MarketDataSubscriptionType.Underlying
            ]);
        } finally {
            this.isLoading = false;
        }

    }

    async stop(): Promise<void> {
        this._tastyClient.quoteStreamer.disconnect();
    }

    getExpirationsWithIronCondors(): IOptionsExpirationVewModel[] {
        return this.expirations.filter(expiration => {
            if(expiration.daysToExpiration < this.services.settings.ironCondorScanner.minDaysToExpiration
                || expiration.daysToExpiration > this.services.settings.ironCondorScanner.maxDaysToExpiration) {
                return false;
            }
            return expiration.ironCondors.length > 0;
        }); //.filter(e => e.expirationDate === "2026-02-20");
    }

    private _streamEventHandler= (records: any[]) => {
        runInAction(() => {
            for(const record of records) {
                if(record.eventSymbol === this.symbol) {
                    if(record.eventType === "Trade") {
                        this.tickerTrade = record;
                    }
                } else {
                    if(record.eventType === "Quote") {
                        //console.log(record);
                        this.optionsQuotes[record.eventSymbol] = record;
                    } else if(record.eventType === "Trade") {
                        this.optionsTrades[record.eventSymbol] = record;
                    } else if(record.eventType === "Greeks") {
                        this.optionsGreeks[record.eventSymbol] = record;
                    }
                }

            }
        })
    }
}