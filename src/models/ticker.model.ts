import {makeObservable, observable, runInAction} from "mobx";
import {OptionsExpirationModel} from "./options-expiration.model";
import {ITickerViewModel} from "./ticker.view-model.interface";
import {IServiceFactory} from "../services/service-factory.interface";
import {IOptionsExpirationVewModel} from "./options-expiration.view-model.interface";
import {
    IGreeksRawData,
    IQuoteRawData, ISymbolMetricsRawData, ITradeRawData
} from "../services/market-data-privider/market-data-provider.service.interface";

export class TickerModel implements ITickerViewModel {
    constructor(public readonly symbol: string,
                public readonly services: IServiceFactory) {

        makeObservable<this, '_isLoading'>(this, {
            expirations: observable,
            _isLoading: observable.ref
        });
    }



    public get currentPrice(): number {
        return this.getSymbolTrade(this.symbol)?.price ?? 0;
    }

    public get ivRank(): number {
        return Math.round((this._marketMetrics?.impliedVolatilityIndexRank ?? 0) * 10000) / 100;
    }

    public  get beta(): number {
        return Math.round((this._marketMetrics?.beta ?? 0) * 100) / 100;
    }

    public expirations: OptionsExpirationModel[] = [];
    private _marketMetrics: ISymbolMetricsRawData | null = null;

    private _isLoading: boolean = true;

    get isLoading(): boolean {
        return this._isLoading;
    }

    set isLoading(value: boolean) {
        runInAction(() => this._isLoading = value);
    }

    getSymbolTrade(symbol: string): ITradeRawData | undefined {
        return this.services.marketDataProvider.getSymbolTrade(symbol);
    }

    getSymbolQuote(symbol: string): IQuoteRawData | undefined {
        return this.services.marketDataProvider.getSymbolQuote(symbol);
    }
    getSymbolGreeks(symbol: string): IGreeksRawData | undefined {
        return this.services.marketDataProvider.getSymbolGreeks(symbol);
    }


    private async _loadMarketData(): Promise<void> {

        if(!this._marketMetrics) {
            this._marketMetrics = await this.services.marketDataProvider.getSymbolMetrics(this.symbol);
        }

        if(this.expirations.length > 0) {
            return;
        }

        const optionsChain = await this.services.marketDataProvider.getOptionsChain(this.symbol);
        const expirations: OptionsExpirationModel[] = []

        for(const optionChain of optionsChain) {
            for(const expiration of optionChain.expirations) {
                expirations.push(new OptionsExpirationModel(expiration, this))
            }
        }

        runInAction(() => {
            this.expirations = expirations;
        });
    }

    private _getAllSymbols(): string[] {
        const allOptionsSymbols: string[] = [this.symbol];
        for(const expiration of this.expirations) {
            expiration.getAllSymbols().forEach(s => allOptionsSymbols.push(s));
        }

        return allOptionsSymbols;
    }

    async start(): Promise<void> {
        this.isLoading = true;
        try {
            await this._loadMarketData();

            this.services.marketDataProvider.subscribe(this._getAllSymbols());

        } finally {
            this.isLoading = false;
        }

    }

    async stop(): Promise<void> {
        this.services.marketDataProvider.unsubscribe(this._getAllSymbols());
    }

    private _filterExpirations(): IOptionsExpirationVewModel[] {
        return this.expirations.filter(expiration =>
            expiration.daysToExpiration >= this.services.settings.ironCondorFilters.minDaysToExpiration
            && expiration.daysToExpiration <= this.services.settings.ironCondorFilters.maxDaysToExpiration);
    }

    getExpirationsWithIronCondors(): IOptionsExpirationVewModel[] {
        return this._filterExpirations().filter(expiration => expiration.ironCondors.length > 0);
    }

    getExpirationsWithPutCreditSpreads(): IOptionsExpirationVewModel[] {
        return this._filterExpirations().filter(expiration => expiration.putCreditSpreads.length > 0);
    }

    getExpirationsWithCallCreditSpreads(): IOptionsExpirationVewModel[] {
        return this._filterExpirations().filter(expiration => expiration.callCreditSpreads.length > 0);
    }

}