import {OptionModel} from "./option.model";
import {TickerModel} from "./ticker/ticker.model";
import {OptionStrikeModel} from "./option-strike.model";
import {
    IOptionsExpirationVewModel,
    OptionExpirationSettlementType,
    OptionExpirationTypeEnum
} from "./options-expiration.view-model.interface";
import {IronCondorModel} from "./iron-condor.model";
import {computed, makeObservable } from "mobx";
import {StrategiesBuilder} from "./strategies-builder";
import {IAppServiceFactory} from "../services/app-service-factory.interface";
import {IOptionsExpirationRawData} from "../services/market-data-provider/market-data-provider.service.interface";
import {PutCreditSpreadModel} from "./put-credit-spread.model";
import {IOptionsStrategyViewModel} from "./options-strategy.view-model.interface";

export class OptionsExpirationModel implements IOptionsExpirationVewModel {
    constructor(private readonly rawData: IOptionsExpirationRawData,
                public readonly ticker: TickerModel) {
        for(const strike of rawData.strikes) {
            this._strikesMap[strike.strikePrice] = new OptionStrikeModel(strike.strikePrice, this, strike.callId, strike.callStreamerSymbol, strike.putId, strike.putStreamerSymbol);
        }

        this._sortedStrikes = Object.values(this._strikesMap).sort((a, b) => a.strikePrice - b.strikePrice);

        this._strategiesBuilder = new StrategiesBuilder(this);

        makeObservable(this, {
            ironCondors: computed,
            putCreditSpreads: computed,
            callCreditSpreads: computed
        });
    }

    private readonly _strategiesBuilder: StrategiesBuilder;

    public get services(): IAppServiceFactory {
        return this.ticker.services;
    }

    get key(): string {
        return `${this.ticker.symbol}-${this.expirationDate.toString()}-${this.daysToExpiration}-${this.expirationType}-${this.settlementType}`;
    }

    get expirationDate(): Date {
        return new Date(this.rawData.expirationDate);
    }

    get daysToExpiration(): number {
        return this.rawData.daysToExpiration;
    }

    get expirationType(): OptionExpirationTypeEnum {
        return this.rawData.expirationType as OptionExpirationTypeEnum;
    }

    get settlementType(): OptionExpirationSettlementType {
        return this.rawData.settlementType as OptionExpirationSettlementType;
    }

    private readonly _strikesMap: Record<number, OptionStrikeModel> = {};
    private readonly _sortedStrikes: OptionStrikeModel[];

    public get strikes(): OptionStrikeModel[] {
        return this._sortedStrikes;
    }

    getAllOptions(): OptionModel[] {
        return this.strikes.map(s => s.put).concat(this.strikes.map(s => s.call));
    }

    getAllStreamerSymbols(): string[] {
        return this.getAllOptions().map(o => o.streamerSymbol);
    }

    public getOTMPuts(): OptionModel[] {
        return this.strikes.filter(s => s.put.isOutOfMoney)
                           .map(s => s.put);
    }

    public getOTMCalls(): OptionModel[] {
        return this.strikes.filter(s => s.call.isOutOfMoney)
                           .map(s => s.call);
    }

    getStrikeByPrice(strikePrice: number): OptionStrikeModel | undefined {
        return this._strikesMap[strikePrice];
    }

    private _filterStrategies<T extends IOptionsStrategyViewModel>(strategies: T[]): T[] {
        return strategies.filter(s => {
            if(!(s.riskRewardRatio > 0 && s.riskRewardRatio <= this.services.strategySettings.strategyFilters.maxRiskRewardRatio)) {
                return false;
            }

            if(s.pop < this.services.strategySettings.strategyFilters.minPop) {
                return false;
            }

            if(this.services.strategySettings.strategyFilters.byExistingPositions === "include") {
                return true;
            }

            return !s.hasLegsWithExistingPositions;
        });
    }

    get ironCondors(): IronCondorModel[] {
        return this._filterStrategies(this._strategiesBuilder.ironCondors);
    }

    get putCreditSpreads(): PutCreditSpreadModel[] {
        return this._filterStrategies(this._strategiesBuilder.putCreditSpreadsSortedByRiskReward);
    }

    get callCreditSpreads(): PutCreditSpreadModel[] {
        return this._filterStrategies(this._strategiesBuilder.callCreditSpreadsSortedByRiskReward);
    }

    getClosestStrikeBelowOrAt(strikePrice: number): OptionStrikeModel | null {
        return this._findClosestStrike(strikePrice, true);
    }

    getClosesStrikeAboveOrAt(strikePrice: number): OptionStrikeModel | null {
        return this._findClosestStrike(strikePrice, false);
    }

    private _findClosestStrike(strikePrice: number, findGreatest: boolean): OptionStrikeModel | null {

        const strikes = this.strikes;

        if (strikes.length === 0) return null;

        let left = 0;
        let right = strikes.length - 1;
        let result: OptionStrikeModel | null = null;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);

            if (findGreatest) {
                //Find the highest strike that is less than or equal with strikePrice
                if (strikes[mid].strikePrice <= strikePrice) {
                    result = strikes[mid];
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            } else {
                // Find the lower strike that is bigger than or equal with strikePrice
                if (strikes[mid].strikePrice >= strikePrice) {
                    result = strikes[mid];
                    right = mid - 1;
                } else {
                    left = mid + 1;
                }
            }
        }

        return result;
    }



}