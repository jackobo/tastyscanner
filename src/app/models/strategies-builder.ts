import {OptionsExpirationModel} from "./options-expiration.model";
import {IronCondorModel} from "./iron-condor.model";
import {OptionModel} from "./option.model";
import {IAppServiceFactory} from "../services/app-service-factory.interface";
import {PutCreditSpreadModel} from "./put-credit-spread.model";
import {CallCreditSpreadModel} from "./call-credit-spread.model";
import {CreditSpreadModel} from "./credit-spread.model";
import {OptionStrikeModel} from "./option-strike.model";
import {Check} from "../../framework/utils/type-checking";


export class StrategiesBuilder {
    constructor(private readonly expiration: OptionsExpirationModel) {
    }

    get services(): IAppServiceFactory {
        return this.expiration.services;
    }

    get minDelta(): number {
        return this.services.strategySettings.strategyFilters.minDelta;
    }

    get maxDelta(): number {
        return this.services.strategySettings.strategyFilters.maxDelta;
    }

    get wings(): number[] {
        return this.services.strategySettings.strategyFilters.wings;
    }

    private _filterByDelta(options: OptionModel[]): OptionModel[] {
        return options.filter(o => o.absoluteDeltaPercent >= this.minDelta && o.absoluteDeltaPercent <= this.maxDelta && o.midPrice > 0)
            .sort((a, b) => b.absoluteDeltaPercent - a.absoluteDeltaPercent);
    }

    getPutsByDelta(): OptionModel[] {
        return this._filterByDelta(this.expiration.getOTMPuts());
    }

    getCallsByDelta(): OptionModel[] {
        const otmCalls = this.expiration.getOTMCalls();
        const nonZeroDeltaCalls = otmCalls.filter(o => o.absoluteDeltaPercent !== 0);
        console.log(nonZeroDeltaCalls);
        const filtered = this._filterByDelta(otmCalls);
        return filtered;
    }

    buildIronCondors(): IronCondorModel[] {
        const putCreditSpreadsByWings = this._buildPutCreditSpreadsUnsorted().groupByKey(pcs => pcs.wingsWidth.toString());
        const callCreditSpreadsByWings = this._buildCallCreditSpreadsUnsorted().groupByKey(ccs => ccs.wingsWidth.toString());

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
                    const condor = new IronCondorModel( putSpread.wingsWidth, putSpread.btoOption, putSpread.stoOption, callSpread.stoOption, callSpread.btoOption, this.services);
                    if(condorsMinDelta <= condor.delta && condor.delta <= condorsMaxDelta) {
                        condors.push(condor);
                    }
                }
            }
        }

        return condors.sort((a, b) => a.riskRewardRatio - b.riskRewardRatio);

    }

    buildPutCreditSpreads(): PutCreditSpreadModel[] {
        return this._buildPutCreditSpreadsUnsorted()
                    .sort((a, b) => a.riskRewardRatio - b.riskRewardRatio);

    }

    private _buildPutCreditSpreadsUnsorted(): PutCreditSpreadModel[] {
        return this._buildCreditSpreads(this.getPutsByDelta(),
            -1,
            strike => strike.put,
            (spreadSize, stoOption, btoOption) => new PutCreditSpreadModel(spreadSize, stoOption, btoOption, this.services));

    }

    buildCallCreditSpreads(): CallCreditSpreadModel[] {

        return this._buildCallCreditSpreadsUnsorted()
                    .sort((a, b) => a.riskRewardRatio - b.riskRewardRatio);


    }

    private _buildCallCreditSpreadsUnsorted(): CallCreditSpreadModel[] {

        return this._buildCreditSpreads(this.getCallsByDelta(),
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