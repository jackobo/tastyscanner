import {NullableDate, NullableNumber} from "../../../../framework/types/nullable-types";
import {OptionType} from "../../../models/option.view-model.interface";

export interface IActivePositionViewModel {
    readonly id: string;
    readonly underlyingSymbol: string;
    readonly createdAt: Date;
    readonly daysToExpiration: NullableNumber;
    readonly profitLossPercent: number;
    readonly profitLoss: number;
    readonly marketPrice: number;
    readonly tradingPrice: number;
    readonly delta: NullableNumber;
    readonly theta: NullableNumber;
    readonly legs: IActivePositionLegViewModel[];


}

export interface IActivePositionLegViewModel {
    readonly symbol: string;
    readonly quantity: number;
    readonly instrumentType: string;
    readonly isSell: boolean;
    readonly optionType: OptionType | null; //put / call
    readonly expirationDate: NullableDate;
    readonly strikePrice: NullableNumber;

    readonly daysToExpiration: NullableNumber;
    readonly profitLossPercent: number;
    readonly profitLoss: number;
    readonly marketPrice: number;
    readonly tradingPrice: number;
    readonly delta: NullableNumber;
    readonly theta: NullableNumber;
    readonly bidPrice: NullableNumber;
    readonly askPrice: NullableNumber;


    //readonly action: string;
    //readonly tradePrice: string;

}