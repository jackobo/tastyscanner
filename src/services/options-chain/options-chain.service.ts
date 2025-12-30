import { makeObservable, observable, runInAction } from "mobx";
import {TickerModel} from "../../models/ticker.model";
import {IOptionsChainService} from "./options-chain.service.interface";
import {ITickerViewModel} from "../../models/ticker.view-model.interface";
import {ServiceBase} from "../service-base";
import {IServiceFactory} from "../service-factory.interface";
import {IOptionsDataProvider} from "./data-providers/options-data-provider.interface";
import {TastyOptionsDataProvider} from "./data-providers/tasty-options-data-provider";

export class OptionsChainService extends ServiceBase implements IOptionsChainService {
    constructor(services: IServiceFactory) {
        super(services);

        makeObservable<this, '_currentTicker'>(this, {
            _currentTicker: observable.ref,
            tickers: observable.ref
        });

        this._dataProvider = new TastyOptionsDataProvider();

        this._dataProvider.start().then(() => {
            runInAction(() => {
                this.tickers = [
                    new TickerModel("SPY", this.services, this._dataProvider),
                    new TickerModel("NVDA", this.services, this._dataProvider),
                    new TickerModel("SLV", this.services, this._dataProvider)
                ];
                this._currentTicker = this.tickers[0];
            })

            return this._currentTicker?.start();
        });

    }


    private readonly _dataProvider: IOptionsDataProvider;

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