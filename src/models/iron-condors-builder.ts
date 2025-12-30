import {OptionsExpirationModel} from "./options-expiration.model";
import {IronCondorModel} from "./iron-condor.model";
import {OptionModel} from "./option.model";

const WINGS = [5, 10]

export class IronCondorsBuilder {
    constructor(private readonly expiration: OptionsExpirationModel) {
    }

    getPutsByDelta(): OptionModel[] {
        return this.expiration.getOTMPuts().filter(put => put.delta >= 10 && put.delta <= 30);
    }

    getCallsByDelta(): OptionModel[] {
        return this.expiration.getOTMCalls().filter(call => call.delta >= 10 && call.delta <= 30);
    }

    build(): IronCondorModel[] {
        const puts = this.getPutsByDelta();
        const calls = this.getCallsByDelta();

        const condors: IronCondorModel[] = [];

        const maxIndex = Math.min(puts.length, calls.length) - 1;

        for(let i = 0; i <= maxIndex; i++) {
            const stoPut = puts[i];
            const stoCall = calls[i];
            for(const wingWidth of WINGS) {
                const btoPut = this.expiration.getStrikeByPrice(stoPut.strike.strikePrice - wingWidth)?.put;
                if(!btoPut) {
                    continue;
                }
                const btoCall = this.expiration.getStrikeByPrice(stoCall.strike.strikePrice + wingWidth)?.call;
                if(!btoCall) {
                    continue;
                }
                condors.push(new IronCondorModel(wingWidth, btoPut, stoPut, stoCall, btoCall));
            }

        }

        return condors;

    }

}