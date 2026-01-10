import {ByEarningsDate, ISettingsService, IStrategyFiltersViewModel, PriceType} from "./settings.service.interface";
import {makeObservable, observable, runInAction} from "mobx";
import {ServiceBase} from "../service-base";
import {IServiceFactory} from "../service-factory.interface";
import {RawLocalStorageKeys} from "../storage/raw-local-storage/raw-local-storage-keys";

export class SettingsService extends ServiceBase implements ISettingsService {
    constructor(services: IServiceFactory) {
        super(services);
        this.strategyFilters = new StrategyFiltersModel(services)
    }
    readonly strategyFilters:StrategyFiltersModel ;
}

export class StrategyFiltersModel implements IStrategyFiltersViewModel {
    constructor(private readonly services: IServiceFactory) {
        this._loadFromStorage();
        makeObservable<this, '_minDelta'
            | '_maxDelta'
            | '_maxRiskRewardRatio'
            | '_minDaysToExpiration'
            | '_maxDaysToExpiration'
            | '_maxBidAskSpread'
            | '_wings'
            | '_priceToUse'
            | '_byEarningsDate'>(this, {
            _minDelta: observable.ref,
            _maxDelta: observable.ref,
            _maxRiskRewardRatio: observable.ref,
            _minDaysToExpiration: observable.ref,
            _maxDaysToExpiration: observable.ref,
            _maxBidAskSpread: observable.ref,
            _wings: observable.ref,
            _priceToUse: observable.ref,
            _byEarningsDate: observable.ref
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
    _byEarningsDate: ByEarningsDate = "all";

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

    get byEarningsDate(): ByEarningsDate {
        return this._byEarningsDate;
    }

    set byEarningsDate(value: ByEarningsDate) {
        this._setProperty(() => this._byEarningsDate = value);
    }

    private _saveToStorage(): void {
        const data = {
            ...this
        }

        this.services.rawLocalStorage.setJson(RawLocalStorageKeys.strategyFilters, data);
    }

    private _loadFromStorage(): void {
        const json = this.services.rawLocalStorage.getJson(RawLocalStorageKeys.strategyFilters);
        if(!json) {
            return;
        }


        for(const key of Object.keys(json)) {
            this[key] = json[key];
        }
    }

}