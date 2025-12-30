import {TickerModel} from "./ticker.model";
import {IOptionViewModel} from "./option.view-model.interface";
import {NullableNumber} from "../utils/nullable-types";
import {Check} from "../utils/type-checking";

export class OptionModel implements IOptionViewModel {
    constructor(public readonly symbol: string,
                private readonly ticker: TickerModel) {
    }

    private get tradeData(): any {
        return this.ticker.optionsTrades[this.symbol];
    }

    private get greeksData(): any {
        return this.ticker.optionsGreeks[this.symbol];
    }

    get lastPrice(): NullableNumber {
        return this.tradeData?.price;
    }

    get delta(): NullableNumber {
        const delta = this.greeksData?.delta;
        if(Check.isNullOrUndefined(delta)) {
            return delta ?? null;
        }

        return Math.round(Math.abs(delta) * 100) / 100;
    }
}