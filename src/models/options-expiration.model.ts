import {OptionModel} from "./option.model";
import {TickerModel} from "./ticker.model";
import {OptionStrikeModel} from "./option-strike.model";
import {IOptionsExpirationVewModel} from "./options-expiration.view-model.interface";
import {IronCondorModel} from "./iron-condor.model";
import {computed, makeObservable } from "mobx";
import {StrategiesBuilder} from "./strategies-builder";
import {IServiceFactory} from "../services/service-factory.interface";
import {IOptionsExpirationRawData} from "../services/market-data-privider/market-data-provider.service.interface";
import {PutCreditSpreadModel} from "./put-credit-spread.model";
import {IStrategyViewModel} from "./strategy.view-model.interface";

export class OptionsExpirationModel implements IOptionsExpirationVewModel {
    constructor(private readonly rawData: IOptionsExpirationRawData,
                public readonly ticker: TickerModel) {
        for(const strike of rawData.strikes) {
            this._strikesMap[strike.strikePrice] = new OptionStrikeModel(strike.strikePrice, this, strike.callStreamerSymbol, strike.putStreamerSymbol);
        }

        this._strategiesBuilder = new StrategiesBuilder(this);

        makeObservable(this, {
            ironCondors: computed,
            putCreditSpreads: computed,
            callCreditSpreads: computed
        });
    }

    private readonly _strategiesBuilder: StrategiesBuilder;

    public get services(): IServiceFactory {
        return this.ticker.services;
    }

    get expirationDate(): string {
        return this.rawData.expirationDate;
    }

    get daysToExpiration(): number {
        return this.rawData.daysToExpiration;
    }

    get expirationType(): string {
        return this.rawData.expirationType;
    }

    private readonly _strikesMap: Record<number, OptionStrikeModel> = {};
    public get strikes(): OptionStrikeModel[] {
        return Object.values(this._strikesMap);
    }

    getAllSymbols(): string[] {
        return this.strikes.map(s => s.call.symbol)
                           .concat(this.strikes.map(s => s.put.symbol));
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

    private _filterStrategies<T extends IStrategyViewModel>(strategies: T[]): T[] {
        return strategies.filter(s => s.riskRewardRatio > 0 && s.riskRewardRatio <= this.services.settings.strategyFilters.maxRiskRewardRatio);
    }

    get ironCondors(): IronCondorModel[] {
        return this._filterStrategies(this._strategiesBuilder.buildIronCondors());
    }

    get putCreditSpreads(): PutCreditSpreadModel[] {
        return this._filterStrategies(this._strategiesBuilder.buildPutCreditSpreads());
    }

    get callCreditSpreads(): PutCreditSpreadModel[] {
        return this._filterStrategies(this._strategiesBuilder.buildCallCreditSpreads());
    }
}