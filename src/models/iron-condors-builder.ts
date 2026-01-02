import {OptionsExpirationModel} from "./options-expiration.model";
import {IronCondorModel} from "./iron-condor.model";
import {OptionModel} from "./option.model";
import {IServiceFactory} from "../services/service-factory.interface";


export class IronCondorsBuilder {
    constructor(private readonly expiration: OptionsExpirationModel) {
    }

    get services(): IServiceFactory {
        return this.expiration.services;
    }

    get minDelta(): number {
        return this.services.settings.ironCondorFilters.minDelta;
    }

    get maxDelta(): number {
        return this.services.settings.ironCondorFilters.maxDelta;
    }

    get wings(): number[] {
        return this.services.settings.ironCondorFilters.wings;
    }

    private _filterByDelta(options: OptionModel[]): OptionModel[] {
        return options.filter(put => put.delta >= this.minDelta && put.delta <= this.maxDelta)
            .sort((a, b) => b.delta - a.delta);
    }

    getPutsByDelta(): OptionModel[] {
        return this._filterByDelta(this.expiration.getOTMPuts());
    }

    getCallsByDelta(): OptionModel[] {
        return this._filterByDelta(this.expiration.getOTMCalls());
    }

    build(): IronCondorModel[] {
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

    private _hasGoodBidAskSpread(options: OptionModel[]): boolean {
        return !options.some(o => o.bidAskSpread > this.services.settings.ironCondorFilters.maxBidAskSpread)
    }

}