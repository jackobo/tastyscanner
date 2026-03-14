import {makeObservable, observable, runInAction} from "mobx";
import {TickerModel} from "../../models/ticker/ticker.model";
import {ISearchTickerResultItem, ITickersService} from "./tickers.service.interface";
import {ITickerViewModel} from "../../models/ticker/ticker.view-model.interface";
import {AppServiceBase} from "../app-service-base";
import {IAppServiceFactory} from "../app-service-factory.interface";
import {AppLocalStorageKeys} from "../storage/app-local-storage-keys";


export class TickersService extends AppServiceBase implements ITickersService {
    constructor(services: IAppServiceFactory) {
        super(services);

        makeObservable<this, '_currentTicker'>(this, {
            _currentTicker: observable.ref,
            recentTickers: observable
        });

        runInAction(() => {
            this.recentTickers = [
                new TickerModel("SPY", this.services)
            ];
            this._loadRecentTickers();
            const lastTicker = this.recentTickers.find(t => t.symbol === this.services.localStorage.getItem(AppLocalStorageKeys.lastSelectedTicker));
            if(lastTicker) {
                this._currentTicker = lastTicker;
            } else {
                this._currentTicker = this.recentTickers[0];
            }

        })

        this._currentTicker?.start();
    }

    private _loadedTickers: Record<string, TickerModel> = {};

    public recentTickers: TickerModel[] = [];

    private _currentTicker: TickerModel | null = null;
    get currentTicker(): ITickerViewModel | null {
        return this._currentTicker;
    }

    async setCurrentTicker(symbol: string): Promise<void> {
        await this._currentTicker?.stop();

        const ticker = this.getTicker(symbol);

        this._addToRecentTickers(ticker);

        runInAction(() => {
            this._currentTicker = ticker;
        });

        if(this._currentTicker) {
            this.services.localStorage.setItem(AppLocalStorageKeys.lastSelectedTicker, this._currentTicker.symbol);
            await this._currentTicker.start();
        }

    }

    getTicker(symbol: string): TickerModel {
        if(!this._loadedTickers[symbol]) {
            this._loadedTickers[symbol] = new TickerModel(symbol, this.services);
        }

        return this._loadedTickers[symbol];
    }

    private _saveRecentTickers(): void {
        this.services.localStorage.setJson(AppLocalStorageKeys.recentTickers, this.recentTickers.map(t => t.symbol));
    }

    private _loadRecentTickers(): void {
        const symbols = this.services.localStorage.getJson<string[]>(AppLocalStorageKeys.recentTickers) ?? [];
        if(symbols.length > 0) {
            runInAction(() => {
                this.recentTickers = symbols.map(s => new TickerModel(s, this.services));
            });
        }

    }

    private _addToRecentTickers(ticker: TickerModel): void {
        const index = this.recentTickers.findIndex(t => t.symbol === ticker.symbol);

        runInAction(() => {
            if(index < 0) {
                this.recentTickers.push(ticker);
            }

            if(this.recentTickers.length > 10) {
                this.recentTickers.splice(0, 1);
            }
            this._saveRecentTickers();
        });

    }

    removeFromRecentTickers(symbol: string): void {
        const index = this.recentTickers.findIndex(t => t.symbol === symbol);
        if(index >= 0) {
            runInAction(() => {
                this.recentTickers.splice(index, 1);
                this._saveRecentTickers();
            });

        }

    }

   async searchTicker(query: string): Promise<ISearchTickerResultItem[]> {
        const result = await this.services.marketDataProvider.searchSymbol(query);

        return result.map(item => {
            return {
                symbol: item.symbol,
                description: item.description
            }
        });
    }

}