import {OptionModel} from "./option.model";
import {TickerModel} from "./ticker.model";
import {OptionStrikeModel} from "./option-strike.model";
import {IOptionsExpirationVewModel} from "./options-expiration.view-model.interface";
import {IronCondorModel} from "./iron-condor.model";
import {computed, makeObservable } from "mobx";
import {IronCondorsBuilder} from "./iron-condors-builder";
import {IServiceFactory} from "../services/service-factory.interface";
import {IOptionsExpirationRawData} from "../services/market-data-privider/market-data-provider.service.interface";

export class OptionsExpirationModel implements IOptionsExpirationVewModel {
    constructor(private readonly rawData: IOptionsExpirationRawData,
                public readonly ticker: TickerModel) {
        for(const strike of rawData.strikes) {
            this._strikesMap[strike.strikePrice] = new OptionStrikeModel(strike.strikePrice, this, strike.callStreamerSymbol, strike.putStreamerSymbol);
        }

        this._ironCondorsBuilder = new IronCondorsBuilder(this);

        makeObservable(this, {
            ironCondors: computed
        });
    }

    private readonly _ironCondorsBuilder: IronCondorsBuilder;

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

    get ironCondors(): IronCondorModel[] {
        return this._ironCondorsBuilder.build().filter(ic => ic.riskRewardRatio > 0 && ic.riskRewardRatio <= this.services.settings.ironCondorFilters.maxRiskRewardRatio);
    }
}