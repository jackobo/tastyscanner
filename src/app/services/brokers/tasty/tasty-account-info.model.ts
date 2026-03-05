import {IBrokerageAccountInfoViewModel} from "../interfaces/brokerage-account.view-model.interface";

export class TastyAccountInfoModel implements IBrokerageAccountInfoViewModel {
    constructor(private readonly accountInfoRawData: any) {
    }

    private _parseAmount(valueAsString: any): number {
        return Math.round(parseFloat(valueAsString) * 100) / 100;
    }

    get cashBalance(): number {
        return this._parseAmount(this.accountInfoRawData['cash-balance']);
    }

    get netLiquidity(): number {
        return this._parseAmount(this.accountInfoRawData['net-liquidating-value'])
    }

    get optionsBuyingPower(): number {
        return this._parseAmount(this.accountInfoRawData['derivative-buying-power']);
    }
    get stocksBuyingPower(): number {
        return this._parseAmount(this.accountInfoRawData['equity-buying-power']);
    }
}