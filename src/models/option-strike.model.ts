import {OptionModel} from "./option.model";

export class OptionStrikeModel {
    constructor(public readonly strikePrice: number,
                public readonly call: OptionModel,
                public readonly put: OptionModel) {
    }
}