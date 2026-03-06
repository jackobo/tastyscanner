import {IBrokerageAccountInfoViewModel} from "../interfaces/brokerage-account.view-model.interface";
import {makeObservable, observable, runInAction} from "mobx";

export class TastyAccountInfoModel implements IBrokerageAccountInfoViewModel {
    constructor(accountInfoRawData: any) {
        this._accountInfoRawData = accountInfoRawData;
        makeObservable<this, '_accountInfoRawData'>(this, {
            _accountInfoRawData: observable.ref
        });
    }

    private _accountInfoRawData: any;

    updateInfo(accountInfoRawData: any): void {
        runInAction(() => {
            this._accountInfoRawData = accountInfoRawData;
        })
    }

    private _parseAmount(valueAsString: any): number {
        return Math.round(parseFloat(valueAsString) * 100) / 100;
    }

    get cashBalance(): number {
        return this._parseAmount(this._accountInfoRawData['cash-balance']);
    }

    get netLiquidity(): number {
        return this._parseAmount(this._accountInfoRawData['net-liquidating-value'])
    }

    get optionsBuyingPower(): number {
        return this._parseAmount(this._accountInfoRawData['derivative-buying-power']);
    }
    get stocksBuyingPower(): number {
        return this._parseAmount(this._accountInfoRawData['equity-buying-power']);
    }


}