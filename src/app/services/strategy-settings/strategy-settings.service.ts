import {
    BestStrategyEnum,
    ByEarningsDate,
    ByExistingPositions,
    IStrategyFiltersViewModel,
    IStrategySettingsService
} from "./strategy-settings.service.interface";
import {makeObservable, observable, runInAction} from "mobx";
import {AppServiceBase} from "../app-service-base";
import {IAppServiceFactory} from "../app-service-factory.interface";
import {AppLocalStorageKeys} from "../storage/app-local-storage-keys";

export class StrategySettingsService extends AppServiceBase implements IStrategySettingsService {
    constructor(services: IAppServiceFactory) {
        super(services);
        this.strategyFilters = new StrategyFiltersModel(services)
    }
    readonly strategyFilters:StrategyFiltersModel ;
}

export class StrategyFiltersModel implements IStrategyFiltersViewModel {
    constructor(private readonly services: IAppServiceFactory) {
        this._loadFromStorage();
        makeObservable(this, {
            _bestStrategy: observable.ref,
            _maxRiskRewardRatio: observable.ref,
            _minPop: observable.ref,
            _minDelta: observable.ref,
            _maxDelta: observable.ref,
            _condorsMinDelta: observable.ref,
            _condorsMaxDelta: observable.ref,
            _condorsMinCallPremiumVsPutPremiumPercentage: observable.ref,
            _condorsMaxCallPremiumVsPutPremiumPercentage: observable.ref,
            _minDaysToExpiration: observable.ref,
            _maxDaysToExpiration: observable.ref,
            _maxBidAskSpread: observable.ref,
            _wings: observable.ref,
            _byEarningsDate: observable.ref,
            _byExistingPositions: observable.ref,
            lastUpdate: observable.ref
        })
    }

    _bestStrategy: BestStrategyEnum[] = [];
    _maxRiskRewardRatio: number = 4;
    _minPop: number = 50;
    _minDelta: number = 10;
    _maxDelta: number = 30;
    _condorsMinDelta: number = -5;
    _condorsMaxDelta: number = 5;
    _condorsMinCallPremiumVsPutPremiumPercentage: number = 0.5;
    _condorsMaxCallPremiumVsPutPremiumPercentage: number = 1.5;
    _minDaysToExpiration: number = 35;
    _maxDaysToExpiration: number = 60;
    _wings: number[] = [5, 10];
    _maxBidAskSpread: number = 5;
    _byExistingPositions: ByExistingPositions = 'exclude';
    _byEarningsDate: ByEarningsDate = "all";
    lastUpdate: number = Date.now()


    private _setProperty(propName: keyof this, value: any): void {
        runInAction(() => this[propName] = value);
        this._saveToStorage(propName, value);
        runInAction(() => this.lastUpdate = Date.now());
    }

    get bestStrategy(): BestStrategyEnum[] {
        return this._bestStrategy;
    }
    set bestStrategy(value) {
        this._setProperty("_bestStrategy", value);
    }

    get maxRiskRewardRatio(): number {
        return this._maxRiskRewardRatio;
    }
    set maxRiskRewardRatio(value) {
        this._setProperty("_maxRiskRewardRatio", value);
    }

    get minPop(): number {
        return this._minPop;
    }
    set minPop(value) {
        this._setProperty("_minPop", value);
    }


    get minDelta(): number {
        return this._minDelta;
    }
    set minDelta(value) {
        this._setProperty("_minDelta", value);
    }

    get maxDelta(): number {
        return this._maxDelta;
    }
    set maxDelta(value) {
        this._setProperty("_maxDelta", value);
    }

    get condorsMinDelta(): number {
        return this._condorsMinDelta;
    }
    set condorsMinDelta(value) {
        this._setProperty("_condorsMinDelta", value);
    }

    get condorsMaxDelta(): number {
        return this._condorsMaxDelta;
    }
    set condorsMaxDelta(value) {
        this._setProperty("_condorsMaxDelta", value);
    }

    get condorsMinCallPremiumVsPutPremiumPercentage(): number {
        return this._condorsMinCallPremiumVsPutPremiumPercentage;
    }

    set condorsMinCallPremiumVsPutPremiumPercentage(value) {
        this._setProperty("_condorsMinCallPremiumVsPutPremiumPercentage", value);
    }

    get condorsMaxCallPremiumVsPutPremiumPercentage(): number {
        return this._condorsMaxCallPremiumVsPutPremiumPercentage;
    }

    set condorsMaxCallPremiumVsPutPremiumPercentage(value) {
        this._setProperty("_condorsMaxCallPremiumVsPutPremiumPercentage", value);
    }


    get minDaysToExpiration(): number {
        return this._minDaysToExpiration;
    }
    set minDaysToExpiration(value) {
        this._setProperty("_minDaysToExpiration", value);
    }

    get maxDaysToExpiration(): number {
        return this._maxDaysToExpiration;
    }
    set maxDaysToExpiration(value) {
        this._setProperty("_maxDaysToExpiration", value);
    }

    get maxBidAskSpread(): number {
        return this._maxBidAskSpread;
    }
    set maxBidAskSpread(value) {
        this._setProperty("_maxBidAskSpread", value);
    }

    get availableWings(): number[] {
        return [5, 10, 15, 20];
    }

    get wings(): number[] {
        return this._wings;
    }
    set wings(value) {
        this._setProperty("_wings", value);
    }


    get byEarningsDate(): ByEarningsDate {
        return this._byEarningsDate;
    }

    set byEarningsDate(value: ByEarningsDate) {
        this._setProperty("_byEarningsDate", value);
    }

    get byExistingPositions(): ByExistingPositions {
        return this._byExistingPositions;
    }
    set byExistingPositions(value: ByExistingPositions) {
        this._setProperty("_byExistingPositions", value);
    }

    private _storedData: any = {};

    private _saveToStorage(propName: keyof this, value: any): void {
        this._storedData[propName] = value;
        this.services.localStorage.setJson(AppLocalStorageKeys.strategyFilters, this._storedData);
    }

    private _loadFromStorage(): void {
        this._storedData = this.services.localStorage.getJson(AppLocalStorageKeys.strategyFilters) ?? {};

        for(const key of Object.keys(this._storedData)) {
            (this as any)[key] = this._storedData[key];
        }
    }

}