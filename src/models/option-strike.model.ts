import {CallOptionModel, OptionModel, PutOptionModel} from "./option.model";
import {IOptionStrikeViewModel} from "./option-strike.view-model.interface";
import {OptionsExpirationModel} from "./options-expiration.model";
import {TickerModel} from "./ticker.model";


export class OptionStrikeModel implements IOptionStrikeViewModel {
    constructor(public readonly strikePrice: number,
                private readonly expiration: OptionsExpirationModel,
                callSymbol: string,
                putSymbol: string) {
        this.call = new CallOptionModel(callSymbol, this);
        this.put = new PutOptionModel(putSymbol, this);
    }

    public readonly call: OptionModel;
    public readonly put: OptionModel;

    get ticker(): TickerModel {
        return this.expiration.ticker;
    }
}