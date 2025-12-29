import {TickerModel} from "./ticker.model";

export class OptionModel {
    constructor(public readonly symbol: string,
                public readonly strikePrice: number,
                private readonly ticker: TickerModel) {
    }

    private get tradeData(): any {
        return this.ticker.optionsTrades[this.symbol];
    }

    private get greeksData(): any {
        return this.ticker.optionsGreeks[this.symbol];
    }

    get lastPrice(): number | null {
        return this.tradeData?.price;
    }

    get delta(): number | null {
        const delta = this.greeksData?.delta;
        if(!delta) {
            return delta;
        }

        return Math.round(delta * 100) / 100;
    }
}