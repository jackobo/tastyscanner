import {OptionModel} from "./option.model";
import {TickerModel} from "./ticker.model";
import {OptionStrikeModel} from "./option-strike.model";
import {IOptionsExpirationVewModel} from "./options-expiration.view-model.interface";
import {IronCondorModel} from "./iron-condor.model";
import {computed, makeObservable } from "mobx";
import {IronCondorsBuilder} from "./iron-condors-builder";

export class OptionsExpirationModel implements IOptionsExpirationVewModel {
    constructor(private readonly rawData: any,
                public readonly ticker: TickerModel) {
        for(const strike of rawData.strikes) {
            const strikePrice = parseFloat(strike["strike-price"]);
            this._strikesMap[strikePrice] = new OptionStrikeModel(strikePrice, this, strike["call-streamer-symbol"], strike["put-streamer-symbol"]);
        }

        this._ironCondorsBuilder = new IronCondorsBuilder(this);

        makeObservable(this, {
            ironCondors: computed
        });
    }

    private readonly _ironCondorsBuilder: IronCondorsBuilder;

    get expirationDate(): string {
        return this.rawData["expiration-date"];
    }

    get daysToExpiration(): number {
        return this.rawData["days-to-expiration"];
    }

    get expirationType(): string {
        return this.rawData["expiration-type"];
    }

    private readonly _strikesMap: Record<number, OptionStrikeModel> = {};
    public get strikes(): OptionStrikeModel[] {
        return Object.values(this._strikesMap);
    }

    getAllSymbols(): string[] {
        return this.strikes.map(s => s.call.symbol)
                           .concat(this.strikes.map(s => s.put.symbol));
    }

    public getOTMPuts(): OptionModel[] {
        return this.strikes.filter(s => s.put.isOutOfMoney)
                           .map(s => s.put);
    }

    public getOTMCalls(): OptionModel[] {
        return this.strikes.filter(s => s.call.isOutOfMoney)
                           .map(s => s.call);
    }

    getStrikeByPrice(strikePrice: number): OptionStrikeModel | undefined {
        return this._strikesMap[strikePrice];
    }

    get ironCondors(): IronCondorModel[] {
        return this._ironCondorsBuilder.build();
    }
}