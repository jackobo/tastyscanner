import {makeObservable, observable, runInAction} from "mobx";
import {OptionsExpirationModel} from "../options-expiration.model";
import {ITickerViewModel} from "./ticker.view-model.interface";
import {IAppServiceFactory} from "../../services/app-service-factory.interface";
import {IOptionsExpirationVewModel} from "../options-expiration.view-model.interface";
import {
    IGreeksRawData,
    IQuoteRawData, ITradeRawData
} from "../../services/market-data-provider/market-data-provider.service.interface";
import {TickerMarketDataReader} from "./ticker-market-data.reader";
import {TickerMetricsModel} from "./ticker-metrics.model";
import {TickerInfoModel} from "./ticker-info.model";


export class TickerModel implements ITickerViewModel {
    constructor(public readonly symbol: string,
                public readonly services: IAppServiceFactory) {

        this._tickerMarketDataReader = new TickerMarketDataReader(this, services);

        makeObservable<this, '_isLoading'>(this, {
            _isLoading: observable.ref
        });
    }

    private _isLoading: boolean = true;

    private readonly _tickerMarketDataReader: TickerMarketDataReader;


    get metrics(): TickerMetricsModel | null {
        return this._tickerMarketDataReader.metrics;
    }

    get info(): TickerInfoModel | null {
        return this._tickerMarketDataReader.info;
    }

    get optionsChain(): OptionsExpirationModel[] {
        return this._tickerMarketDataReader.optionsChain;
    }

    public get currentPrice(): number {
        return this.getSymbolTrade(this.symbol)?.price ?? 0;
    }


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

    private _getAllStreamerSymbols(): string[] {
        const allStreamerSymbols: string[] = [this.symbol];
        for(const expiration of this.optionsChain) {
            expiration.getAllStreamerSymbols().forEach(s => allStreamerSymbols.push(s));
        }

        return allStreamerSymbols;
    }

    async start(): Promise<void> {
        this.isLoading = true;
        try {
            await this._tickerMarketDataReader.loadAll();

            this.services.marketDataProvider.subscribeToStreamer(this._getAllStreamerSymbols());

        } finally {
            this.isLoading = false;
        }

    }

    async stop(): Promise<void> {
        this.services.marketDataProvider.unsubscribeFromStreamer(this._getAllStreamerSymbols());
    }

    private _shouldIncludeExpiration(expiration: OptionsExpirationModel): boolean {
        const filters = this.services.strategySettings.strategyFilters;
        if(expiration.daysToExpiration < filters.minDaysToExpiration
            || expiration.daysToExpiration > filters.maxDaysToExpiration) {
            return false;
        }

        const daysUntilEarnings = this.metrics?.daysUntilEarnings ?? 0;

        if(daysUntilEarnings <= 0) {
            return true;
        }

        switch (filters.byEarningsDate) {
            case 'before':
                return expiration.daysToExpiration < daysUntilEarnings;
            case 'after':
                return expiration.daysToExpiration > daysUntilEarnings;
            default:
                return true;
        }

    }

    private _filterExpirations(): IOptionsExpirationVewModel[] {
        return this.optionsChain.filter(expiration => this._shouldIncludeExpiration(expiration))
            .sort((a, b) => a.daysToExpiration - b.daysToExpiration);
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