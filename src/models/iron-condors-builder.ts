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
        return this.services.settings.ironCondorScanner.minDelta;
    }

    get maxDelta(): number {
        return this.services.settings.ironCondorScanner.maxDelta;
    }

    get wings(): number[] {
        return this.services.settings.ironCondorScanner.wings;
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
        const puts = this.getPutsByDelta();
        const calls = this.getCallsByDelta();

        const condors: IronCondorModel[] = [];

        const maxIndex = Math.min(puts.length, calls.length) - 1;

        for(let i = 0; i <= maxIndex; i++) {
            const stoPut = puts[i];
            const stoCall = calls[i];
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

        return condors.sort((a, b) => a.riskRewardRatio - b.riskRewardRatio);

    }

    private _hasGoodBidAskSpread(options: OptionModel[]): boolean {
        return !options.some(o => o.bidAskSpread > this.services.settings.ironCondorScanner.maxBidAskSpread)
    }

}