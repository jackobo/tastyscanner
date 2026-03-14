import {IAppServiceFactory} from "../../services/app-service-factory.interface";
import {TickerInfoModel} from "./ticker-info.model";
import {TickerMetricsModel} from "./ticker-metrics.model";
import {makeObservable, observable, runInAction} from "mobx";
import {OptionsExpirationModel} from "../options-expiration.model";
import {TickerModel} from "./ticker.model";

export class TickerMarketDataReader {
    constructor(private readonly ticker: TickerModel, private readonly services: IAppServiceFactory) {
        makeObservable<this, '_info' | '_metrics' | '_optionsChain'>(this, {
            _info: observable.ref,
            _metrics: observable.ref,
            _optionsChain: observable.ref,
        })
    }

    get symbol(): string {
        return this.ticker.symbol;
    }

    private _info: TickerInfoModel | null = null;
    get info(): TickerInfoModel | null {
        if(!this._info) {
            this.getSymbolInfoAsync();
        }
        return this._info;
    }
    private _metrics: TickerMetricsModel | null = null;
    get metrics(): TickerMetricsModel | null {
        if(!this._metrics) {
            this.getSymbolMetricsAsync();
        }
        return this._metrics;
    }
    private _optionsChain: OptionsExpirationModel[] | null = null;
    get optionsChain(): OptionsExpirationModel[] {
        if(!this._optionsChain) {
            this.getSymbolOptionsChainAsync();
        }
        return this._optionsChain ?? [];
    }

    async loadAll(): Promise<void> {
        await Promise.all([this.getSymbolInfoAsync(), this.getSymbolMetricsAsync(), this.getSymbolOptionsChainAsync()])
    }

    private _symbolInfoPromise: Promise<TickerInfoModel> | null = null;

    getSymbolInfoAsync(): Promise<TickerInfoModel> {
        if(!this._symbolInfoPromise) {
            this._symbolInfoPromise = this.services.marketDataProvider.getSymbolInfo(this.symbol).then(data => {
                const info =  new TickerInfoModel(data);
                runInAction(() => {
                    this._info = info;
                })
                return info;
            }).catch(err => {
                this.services.logger.error(`Failed to read ${this.symbol} info`, err);
                this._symbolInfoPromise = null;
                throw err;
            });
        }

        return this._symbolInfoPromise;

    }

    private _symbolMetricsPromise: Promise<TickerMetricsModel> | null = null;

    getSymbolMetricsAsync(): Promise<TickerMetricsModel> {
        if(!this._symbolMetricsPromise) {
            this._symbolMetricsPromise = this.services.marketDataProvider.getSymbolMetrics(this.symbol).then(data => {
                const metrics = new TickerMetricsModel(data);
                runInAction(() => {
                    this._metrics = metrics;
                })
                return metrics;
            }).catch(err => {
                this.services.logger.error(`Failed to read ${this.symbol} metrics`, err);
                this._symbolMetricsPromise = null;
                throw err;
            });
        }

        return this._symbolMetricsPromise;
    }

    private _symbolOptionsChainPromise: Promise<OptionsExpirationModel[]> | null = null;

    getSymbolOptionsChainAsync(): Promise<OptionsExpirationModel[]> {
        if(!this._symbolOptionsChainPromise) {
            this._symbolOptionsChainPromise = this.services.marketDataProvider.getOptionsChain(this.symbol)
                .then(data => {
                    const optionsChain: OptionsExpirationModel[] = []

                    for(const optionChain of data) {
                        for(const expiration of optionChain.expirations) {
                            if(expiration.daysToExpiration <= 365) { //maximum 1 year is enough
                                optionsChain.push(new OptionsExpirationModel(expiration, this.ticker))
                            }
                        }
                    }

                    runInAction(() => {
                        this._optionsChain = optionsChain;
                    })
                    return optionsChain;
                })
                .catch(err => {
                    this.services.logger.error(`Failed to read ${this.symbol} options chain`, err);
                    this._symbolOptionsChainPromise = null;
                    throw err;
                });
        }

        return this._symbolOptionsChainPromise;
    }
}