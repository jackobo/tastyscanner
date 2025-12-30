import {IronCondorScannerSettingsViewModel, ISettingsService} from "./settings.service.interface";
import {makeObservable, observable, runInAction} from "mobx";

export class SettingsService implements ISettingsService {
    readonly ironCondorScanner = new IronCondorScannerSettingsModel();
}

export class IronCondorScannerSettingsModel implements IronCondorScannerSettingsViewModel {
    constructor() {
        makeObservable<this, '_minDelta' | '_maxDelta' | '_maxRiskRewardRatio' | '_minDaysToExpiration' | '_maxDaysToExpiration' | '_wings'>(this, {
            _minDelta: observable.ref,
            _maxDelta: observable.ref,
            _maxRiskRewardRatio: observable.ref,
            _minDaysToExpiration: observable.ref,
            _maxDaysToExpiration: observable.ref,
            _wings: observable.ref
        })
    }

    _minDelta: number = 10;
    _maxDelta: number = 30;
    _maxRiskRewardRatio: number = 4;
    _minDaysToExpiration: number = 35;
    _maxDaysToExpiration: number = 60;
    _wings: number[] = [5, 10];

    get minDelta(): number {
        return this._minDelta;
    }
    set minDelta(value) {
        runInAction(() => this._minDelta = value);

    }

    get maxDelta(): number {
        return this._maxDelta;
    }
    set maxDelta(value) {
        runInAction(() => this._maxDelta = value);
    }

    get maxRiskRewardRatio(): number {
        return this._maxRiskRewardRatio;
    }
    set maxRiskRewardRatio(value) {
        runInAction(() => this._maxRiskRewardRatio = value);
    }

    get minDaysToExpiration(): number {
        return this._minDaysToExpiration;
    }
    set minDaysToExpiration(value) {
        runInAction(() => this._minDaysToExpiration = value);
    }

    get maxDaysToExpiration(): number {
        return this._maxDaysToExpiration;
    }
    set maxDaysToExpiration(value) {
        runInAction(() => this._maxDaysToExpiration = value);
    }

    get availableWings(): number[] {
        return [5, 10, 15, 20];
    }

    get wings(): number[] {
        return this._wings;
    }
    set wings(value) {
        runInAction(() => this._wings = value);
    }


}