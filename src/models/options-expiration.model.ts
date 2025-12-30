import {OptionModel} from "./option.model";
import {TickerModel} from "./ticker.model";
import {OptionStrikeModel} from "./option-strike.model";
import {IOptionsExpirationVewModel} from "./options-expiration.view-model.interface";

export class OptionsExpirationModel implements IOptionsExpirationVewModel {
    constructor(public readonly rawData: any, private readonly ticker: TickerModel) {
        for(const strike of rawData.strikes) {
            const strikePrice = parseFloat(strike["strike-price"]);
            const put = new OptionModel(strike["put-streamer-symbol"], this.ticker);
            const call = new OptionModel(strike["call-streamer-symbol"], this.ticker);
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