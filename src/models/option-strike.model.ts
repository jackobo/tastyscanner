import {OptionModel} from "./option.model";
import {IOptionStrikeViewModel} from "./option-strike.view-model.interface";


export class OptionStrikeModel implements IOptionStrikeViewModel {
    constructor(public readonly strikePrice: number,
                public readonly call: OptionModel,
                public readonly put: OptionModel) {
    }
}