import {OptionsExpirationModel} from "./options-expiration.model";
import {IronCondorModel} from "./iron-condor.model";
import {OptionModel} from "./option.model";
import {IAppServiceFactory} from "../services/app-service-factory.interface";
import {PutCreditSpreadModel} from "./put-credit-spread.model";
import {CallCreditSpreadModel} from "./call-credit-spread.model";
import {CreditSpreadModel} from "./credit-spread.model";
import {OptionStrikeModel} from "./option-strike.model";
import {Check} from "../../framework/utils/type-checking";
import {computed, makeObservable} from "mobx";


export class StrategiesBuilder {
    constructor(private readonly expiration: OptionsExpirationModel) {
        makeObservable(this, {
            putsFilteredByDelta: computed,
            callsFilteredByDelta: computed,
            putCreditSpreadsUnsorted: computed,
            callCreditSpreadsUnsorted: computed,
            ironCondors: computed,
            putCreditSpreadsSortedByRiskReward: computed,
            callCreditSpreadsSortedByRiskReward: computed,
        });
    }

    get services(): IAppServiceFactory {
        return this.expiration.services;
    }

    get minDelta(): number {
        return this.services.strategySettings.strategyFilters.minDelta / 100;
    }

    get maxDelta(): number {
        return this.services.strategySettings.strategyFilters.maxDelta / 100;
    }


    get wings(): number[] {
        return this.services.strategySettings.strategyFilters.wings;
    }

    private _filterByDelta(options: OptionModel[]): OptionModel[] {
        return options.filter(o => o.absoluteRawDelta >= this.minDelta && o.absoluteRawDelta <= this.maxDelta && o.midPrice > 0)
            .sort((a, b) => b.absoluteRawDelta - a.absoluteRawDelta);
    }

    get putsFilteredByDelta(): OptionModel[] {
        return this._filterByDelta(this.expiration.getOTMPuts());
    }

    get callsFilteredByDelta(): OptionModel[] {
        return this._filterByDelta(this.expiration.getOTMCalls());
    }

    get ironCondors(): IronCondorModel[] {
        const putCreditSpreadsByWings = this.putCreditSpreadsUnsorted.groupByKey(pcs => pcs.wingsWidth.toString());
        const callCreditSpreadsByWings = this.callCreditSpreadsUnsorted.groupByKey(ccs => ccs.wingsWidth.toString());

        const condors: IronCondorModel[] = [];

        const condorsMinDelta = this.services.strategySettings.strategyFilters.condorsMinDelta;
        const condorsMaxDelta = this.services.strategySettings.strategyFilters.condorsMaxDelta;

        for(const wing of Object.keys(putCreditSpreadsByWings)) {
            const putCreditSpreads = putCreditSpreadsByWings[wing];
            const callCreditSpreads = callCreditSpreadsByWings[wing];
            if(Check.isEmpty(callCreditSpreads)) {
                continue;
            }
            for(const putSpread of putCreditSpreads) {
                for(const callSpread of callCreditSpreads) {
                    const condor = new IronCondorModel( putSpread.wingsWidth, putSpread, callSpread, this.services);
                    if(condorsMinDelta <= condor.delta && condor.delta <= condorsMaxDelta) {
                        condors.push(condor);
                    }
                }
            }
        }

        return condors.sort((a, b) => a.riskRewardRatio - b.riskRewardRatio);

    }

    get putCreditSpreadsSortedByRiskReward(): PutCreditSpreadModel[] {
        return this.putCreditSpreadsUnsorted
                    .sort((a, b) => a.riskRewardRatio - b.riskRewardRatio);

    }

    get putCreditSpreadsUnsorted(): PutCreditSpreadModel[] {
        return this._buildCreditSpreads(this.putsFilteredByDelta,
            -1,
            strike => strike.put,
            (spreadSize, stoOption, btoOption) => new PutCreditSpreadModel(spreadSize, stoOption, btoOption, this.services));

    }

    get callCreditSpreadsSortedByRiskReward(): CallCreditSpreadModel[] {

        return this.callCreditSpreadsUnsorted
                    .sort((a, b) => a.riskRewardRatio - b.riskRewardRatio);


    }

    get callCreditSpreadsUnsorted(): CallCreditSpreadModel[] {

        return this._buildCreditSpreads(this.callsFilteredByDelta,
            1,
            strike => strike.call,
            (spreadSize, stoOption, btoOption) => new CallCreditSpreadModel(spreadSize, stoOption, btoOption, this.services));


    }

    private _buildCreditSpreads<TCreditSpread extends CreditSpreadModel>(options: OptionModel[],
                                                                         wingIncrementSign: -1 | 1,
                                                                         getStrikeOption: (strike: OptionStrikeModel) => OptionModel,
                                                                         createSpread:(spreadSize: number, stoOption: OptionModel, btoOption: OptionModel) => TCreditSpread): TCreditSpread[] {
        const creditSpreads: TCreditSpread[] = [];

        for(let i = 0; i < options.length; i++) {
            const stoOption = options[i];
            if(stoOption.midPrice <= 0) {
                continue;
            }
            for(const wingWidth of this.wings) {
                const strike = this.expiration.getStrikeByPrice(stoOption.strike.strikePrice + (wingIncrementSign * wingWidth));
                if(!strike) {
                    continue;
                }
                const btoOption =  getStrikeOption(strike);
                if(!btoOption || btoOption.midPrice <= 0) {
                    continue;
                }

                if(this._hasGoodBidAskSpread([stoOption, btoOption])) {
                    creditSpreads.push(createSpread(wingWidth, stoOption, btoOption));
                }

            }
        }

        return creditSpreads;
    }

    private _hasGoodBidAskSpread(options: OptionModel[]): boolean {
        return !options.some(o => o.bidAskSpread < 0 || o.bidAskSpread > this.services.strategySettings.strategyFilters.maxBidAskSpread)
    }

}