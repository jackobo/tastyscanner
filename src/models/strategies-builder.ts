import {OptionsExpirationModel} from "./options-expiration.model";
import {IronCondorModel} from "./iron-condor.model";
import {OptionModel} from "./option.model";
import {IServiceFactory} from "../services/service-factory.interface";
import {PutCreditSpreadModel} from "./put-credit-spread.model";
import {CallCreditSpreadModel} from "./call-credit-spread.model";


export class StrategiesBuilder {
    constructor(private readonly expiration: OptionsExpirationModel) {
    }

    get services(): IServiceFactory {
        return this.expiration.services;
    }

    get minDelta(): number {
        return this.services.settings.strategyFilters.minDelta;
    }

    get maxDelta(): number {
        return this.services.settings.strategyFilters.maxDelta;
    }

    get wings(): number[] {
        return this.services.settings.strategyFilters.wings;
    }

    private _filterByDelta(options: OptionModel[]): OptionModel[] {
        return options.filter(o => o.delta >= this.minDelta && o.delta <= this.maxDelta && o.lastPrice > 0)
            .sort((a, b) => b.delta - a.delta);
    }

    getPutsByDelta(): OptionModel[] {
        return this._filterByDelta(this.expiration.getOTMPuts());
    }

    getCallsByDelta(): OptionModel[] {
        return this._filterByDelta(this.expiration.getOTMCalls());
    }

    buildIronCondors(): IronCondorModel[] {
        const puts = this.getPutsByDelta().groupByKey(put => put.delta.toString());
        const calls = this.getCallsByDelta().groupByKey(call => call.delta.toString());

        const putsDeltas = Object.keys(puts).map(d => parseFloat(d)).sort((a, b) => b - a);
        const callsDeltas = Object.keys(calls).map(d => parseFloat(d)).sort((a, b) => b - a);

        const condors: IronCondorModel[] = [];

        const maxIndex = Math.min(putsDeltas.length, callsDeltas.length) - 1;

        for(let i = 0; i <= maxIndex; i++) {
            const stoPuts = puts[putsDeltas[i].toString()];
            const stoCalls = calls[callsDeltas[i].toString()];
            for(const stoPut of stoPuts) {
                for(const stoCall of stoCalls) {
                    for(const wingWidth of this.wings) {
                        const btoPut = this.expiration.getStrikeByPrice(stoPut.strike.strikePrice - wingWidth)?.put;
                        if(!btoPut) {
                            continue;
                        }
                        const btoCall = this.expiration.getStrikeByPrice(stoCall.strike.strikePrice + wingWidth)?.call;
                        if(!btoCall) {
                            continue;
                        }
                        if(this._hasGoodBidAskSpread([btoPut, stoPut, stoCall, btoCall])) {
                            condors.push(new IronCondorModel(wingWidth, btoPut, stoPut, stoCall, btoCall));
                        }

                    }
                }
            }
        }

        return condors.sort((a, b) => a.riskRewardRatio - b.riskRewardRatio);

    }

    buildPutCreditSpreads(): PutCreditSpreadModel[] {
        const putSpreads: PutCreditSpreadModel[] = [];
        const puts = this.getPutsByDelta();
        for(let i = 0; i < puts.length; i++) {
            const stoPut = puts[i];
            for(const wingWidth of this.wings) {
                const btoPut = this.expiration.getStrikeByPrice(stoPut.strike.strikePrice - wingWidth)?.put;
                if(!btoPut) {
                    continue;
                }

                if(this._hasGoodBidAskSpread([btoPut, stoPut])) {
                    putSpreads.push(new PutCreditSpreadModel(wingWidth, stoPut, btoPut));
                }

            }
        }

        return putSpreads;
    }

    buildCallCreditSpreads(): CallCreditSpreadModel[] {
        const callSpreads: CallCreditSpreadModel[] = [];
        const calls = this.getCallsByDelta();
        for(let i = 0; i < calls.length; i++) {
            const stoCall = calls[i];
            for(const wingWidth of this.wings) {
                const btoCall = this.expiration.getStrikeByPrice(stoCall.strike.strikePrice + wingWidth)?.call;
                if(!btoCall) {
                    continue;
                }

                if(this._hasGoodBidAskSpread([stoCall, btoCall])) {
                    callSpreads.push(new CallCreditSpreadModel(wingWidth, stoCall, btoCall));
                }

            }
        }

        return callSpreads;
    }

    private _hasGoodBidAskSpread(options: OptionModel[]): boolean {
        return !options.some(o => o.bidAskSpread > this.services.settings.strategyFilters.maxBidAskSpread)
    }

}