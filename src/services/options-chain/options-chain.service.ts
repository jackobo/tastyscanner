import { makeObservable, observable, runInAction } from "mobx";
import {TickerModel} from "../../models/ticker.model";
import {IOptionsChainService} from "./options-chain.service.interface";
import {ITickerViewModel} from "../../models/ticker.view-model.interface";
import {ServiceBase} from "../service-base";
import {IServiceFactory} from "../service-factory.interface";

export class OptionsChainService extends ServiceBase implements IOptionsChainService {
    constructor(services: IServiceFactory) {
        super(services);
        this.tickers = [
            new TickerModel("SPY", this.services),
            new TickerModel("NVDA", this.services),
            new TickerModel("GOOGL", this.services)];
        this._currentTicker = this.tickers[0];
        makeObservable<this, '_currentTicker'>(this, {
            _currentTicker: observable.ref
        });
    }


    public tickers: TickerModel[];

    private _currentTicker: ITickerViewModel;
    get currentTicker(): ITickerViewModel {
        return this._currentTicker;
    }

    set currentTicker(ticker: ITickerViewModel) {
        runInAction(() => this._currentTicker = ticker);
    }


}