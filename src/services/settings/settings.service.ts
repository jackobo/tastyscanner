import {IStrategyFiltersViewModel, ISettingsService, PriceType} from "./settings.service.interface";
import {makeObservable, observable, runInAction} from "mobx";

export class SettingsService implements ISettingsService {
    readonly strategyFilters = new StrategyFiltersModel();
}

export class StrategyFiltersModel implements IStrategyFiltersViewModel {
    constructor() {
        this._loadFromStorage();
        makeObservable<this, '_minDelta'
            | '_maxDelta'
            | '_maxRiskRewardRatio'
            | '_minDaysToExpiration'
            | '_maxDaysToExpiration'
            | '_maxBidAskSpread'
            | '_wings'
            | '_priceToUse'>(this, {
            _minDelta: observable.ref,
            _maxDelta: observable.ref,
            _maxRiskRewardRatio: observable.ref,
            _minDaysToExpiration: observable.ref,
            _maxDaysToExpiration: observable.ref,
            _maxBidAskSpread: observable.ref,
            _wings: observable.ref,
            _priceToUse: observable.ref
        })
    }

    _minDelta: number = 10;
    _maxDelta: number = 30;
    _maxRiskRewardRatio: number = 4;
    _minDaysToExpiration: number = 35;
    _maxDaysToExpiration: number = 60;
    _wings: number[] = [5, 10];
    _priceToUse: PriceType = "last";
    _maxBidAskSpread: number = 5;

    private _setProperty(setter: () => void): void {
        runInAction(setter);
        this._saveToStorage();
    }
    
    get minDelta(): number {
        return this._minDelta;
    }
    set minDelta(value) {
        this._setProperty(() => this._minDelta = value);

    }

    get maxDelta(): number {
        return this._maxDelta;
    }
    set maxDelta(value) {
        this._setProperty(() => this._maxDelta = value);
    }

    get maxRiskRewardRatio(): number {
        return this._maxRiskRewardRatio;
    }
    set maxRiskRewardRatio(value) {
        this._setProperty(() => this._maxRiskRewardRatio = value);
    }

    get minDaysToExpiration(): number {
        return this._minDaysToExpiration;
    }
    set minDaysToExpiration(value) {
        this._setProperty(() => this._minDaysToExpiration = value);
    }

    get maxDaysToExpiration(): number {
        return this._maxDaysToExpiration;
    }
    set maxDaysToExpiration(value) {
        this._setProperty(() => this._maxDaysToExpiration = value);
    }

    get maxBidAskSpread(): number {
        return this._maxBidAskSpread;
    }
    set maxBidAskSpread(value) {
        this._setProperty(() => this._maxBidAskSpread = value);
    }

    get availableWings(): number[] {
        return [5, 10, 15, 20];
    }

    get wings(): number[] {
        return this._wings;
    }
    set wings(value) {
        this._setProperty(() => this._wings = value);
    }

    get priceToUse(): PriceType {
        return this._priceToUse;
    }

    set priceToUse(value: PriceType) {
        this._setProperty(() => this._priceToUse = value);
    }

    private _saveToStorage(): void {
        const data = {
            ...this
        }

        localStorage.setItem('strategyFilters', JSON.stringify(data));
    }

    private _loadFromStorage(): void {
        const json = localStorage.getItem('strategyFilters');
        if(!json) {
            return;
        }

        const data = JSON.parse(json);
        for(const key of Object.keys(data)) {
            this[key] = data[key];
        }
    }

}