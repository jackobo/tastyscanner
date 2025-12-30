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

        makeObservable(this, {
            tickerTrade: observable.ref,
            optionsQuotes: observable,
            optionsTrades: observable,
            optionsGreeks: observable,
            expirations: observable
        })



        this._start();
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

    private async _start(): Promise<void> {
        await this._tastyClient.quoteStreamer.connect();

        const optionsChain = await this._tastyClient.instrumentsService.getNestedOptionChain(this.symbol);
        //const marketData = await this._tastyClient.httpClient.getData(`/market-data/by-type`,{}, {"equity": this.symbol});

        //console.log(marketData);

        runInAction(() => {
            for(const optionChain of optionsChain) {
                for(const expiration of optionChain.expirations) {
                    this.expirations.push(new OptionsExpirationModel(expiration, this))
                }
            }
        })



        this._tastyClient.quoteStreamer.addEventListener((records: any[]) => {
            runInAction(() => {
                for(const record of records) {
                    if(record.eventSymbol === this.symbol) {
                        if(record.eventType === "Trade") {
                            this.tickerTrade = record;
                        }
                    } else {
                        if(record.eventType === "Quote") {
                            this.optionsQuotes[record.eventSymbol] = record;
                        } else if(record.eventType === "Trade") {
                            this.optionsTrades[record.eventSymbol] = record;
                        } else if(record.eventType === "Greeks") {
                            this.optionsGreeks[record.eventSymbol] = record;
                        }
                    }

                }
            })

        });

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
}