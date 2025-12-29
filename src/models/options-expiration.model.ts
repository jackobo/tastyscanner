import {OptionModel} from "./option.model";
import {TickerModel} from "./ticker.model";
import {OptionStrikeModel} from "./option-strike.model";

export class OptionsExpirationModel {
    constructor(public readonly rawData: any, private readonly ticker: TickerModel) {
        for(const strike of rawData.strikes) {
            const strikePrice = parseFloat(strike["strike-price"]);
            /*
            if(strikePrice > this.ticker.currentPrice * 0.9 && strikePrice < this.ticker.currentPrice * 1.1) {
                const put = new OptionModel(strike["put-streamer-symbol"], strikePrice, this.ticker);
                const call = new OptionModel(strike["call-streamer-symbol"], strikePrice, this.ticker);
                this.strikes.push(new OptionStrikeModel(strikePrice, call, put));
            }

             */

            const put = new OptionModel(strike["put-streamer-symbol"], strikePrice, this.ticker);
            const call = new OptionModel(strike["call-streamer-symbol"], strikePrice, this.ticker);
            this.strikes.push(new OptionStrikeModel(strikePrice, call, put));

        }
    }

    get expirationDate(): string {
        return this.rawData["expiration-date"];
    }

    get daysToExpiration(): number {
        return this.rawData["days-to-expiration"];
    }

    get expirationType(): string {
        return this.rawData["expiration-type"];
    }

    public readonly strikes: OptionStrikeModel[] = [];

    getAllSymbols(): string[] {
        return this.strikes.map(s => s.call.symbol)
                           .concat(this.strikes.map(s => s.put.symbol));
    }
}