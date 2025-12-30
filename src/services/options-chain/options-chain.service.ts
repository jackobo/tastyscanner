import { makeObservable, observable, runInAction } from "mobx";
import {TickerModel} from "../../models/ticker.model";
import {IOptionsChainService} from "./options-chain.service.interface";
import {ITickerViewModel} from "../../models/ticker.view-model.interface";

export class OptionsChainService implements IOptionsChainService {
    constructor() {
        this.tickers = [new TickerModel("NVDA") , new TickerModel("GOOGL")];
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