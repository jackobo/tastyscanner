import { makeObservable, observable, runInAction } from "mobx";
import {TickerModel} from "../../models/ticker.model";
import {ITickersService} from "./tickers.service.interface";
import {ITickerViewModel} from "../../models/ticker.view-model.interface";
import {ServiceBase} from "../service-base";
import {IServiceFactory} from "../service-factory.interface";


export class TickersService extends ServiceBase implements ITickersService {
    constructor(services: IServiceFactory) {
        super(services);

        makeObservable<this, '_currentTicker'>(this, {
            _currentTicker: observable.ref,
            tickers: observable.ref
        });



        this.services.marketDataProvider.start().then(() => {
            runInAction(() => {
                this.tickers = [
                    new TickerModel("SPY", this.services),
                    new TickerModel("NVDA", this.services),
                    new TickerModel("SLV", this.services)
                ];
                this._currentTicker = this.tickers[0];
            })

            return this._currentTicker?.start();
        });

    }


    public tickers: TickerModel[] = [];

    private _currentTicker: TickerModel | null = null;
    get currentTicker(): ITickerViewModel | null {
        return this._currentTicker;
    }

    set currentTicker(ticker: ITickerViewModel) {
        this._currentTicker?.stop();
        runInAction(() => {
            this._currentTicker = ticker as TickerModel;
            this._currentTicker.start();
        });
    }


}