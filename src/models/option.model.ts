import {TickerModel} from "./ticker.model";
import {IOptionViewModel} from "./option.view-model.interface";
import {Check} from "../utils/type-checking";
import {OptionStrikeModel} from "./option-strike.model";
import {
    IGreeksRawData,
    IQuoteRawData,
    ITradeRawData
} from "../services/market-data-privider/market-data-provider.service.interface";

export abstract class OptionModel implements IOptionViewModel {
    constructor(public readonly symbol: string,
                public readonly strike: OptionStrikeModel) {
    }

    abstract get isOutOfMoney(): boolean;
    abstract get optionType(): string;

    protected get ticker(): TickerModel {
        return this.strike.ticker;
    }

    protected get tradeData(): ITradeRawData | undefined {
        return this.ticker.getSymbolTrade(this.symbol);
    }

    protected get quoteData(): IQuoteRawData | undefined {
        return this.ticker.getSymbolQuote(this.symbol);
    }

    protected get greeksData(): IGreeksRawData | undefined {
        return this.ticker.getSymbolGreeks(this.symbol);
    }

    get strikePrice(): number {
        return this.strike.strikePrice;
    }

    get lastPrice(): number {
        const p = this.tradeData?.price || 0;
        if(Check.isNumber(p)) {
            return p;
        }

        return 0;
    }

    get bidPrice(): number {
        return this.quoteData?.bidPrice ?? 0;
    }

    get askPrice(): number {
        return this.quoteData?.askPrice ?? 0;
    }

    get midPrice(): number {
        return Math.round(((this.bidPrice + this.askPrice) / 2) * 100) / 100;
    }

    get priceForStrategyBuilder(): number {
        //return this.midPrice;
        return this.lastPrice;
    }

    get bidAskSpread(): number {
        return ((this.askPrice - this.bidPrice) / this.bidPrice) * 100;
    }

    get delta(): number {
        const delta = this.greeksData?.delta;
        if(Check.isNullOrUndefined(delta)) {
            return 0;
        }

        return Math.round(Math.abs(delta) * 100);
    }
}

export class PutOptionModel extends OptionModel {
    get optionType(): string {
        return "P";
    }

    get isOutOfMoney(): boolean {
        return this.strike.strikePrice < this.ticker.currentPrice;
    }
}

export class CallOptionModel extends OptionModel {
    get optionType(): string {
        return "C";
    }
    get isOutOfMoney(): boolean {
        return this.strike.strikePrice > this.ticker.currentPrice;
    }
}