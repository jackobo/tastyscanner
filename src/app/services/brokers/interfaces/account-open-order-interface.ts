import {NullableDate, NullableNumber} from "../../../../framework/types/nullable-types";

export interface IAccountOpenOrderViewModel {
    readonly id: string;
    readonly underlyingSymbol: string;
    readonly createdAt: Date;
    readonly tradingPrice: number;
    readonly legs: IAccountOpenOrderLegViewModel[];
    readonly daysToExpiration: NullableNumber;
}

export interface IAccountOpenOrderLegViewModel {
    readonly symbol: string;
    readonly quantity: number;
    readonly instrumentType: string;
    readonly tradingPrice: number;
    readonly isSell: boolean;
    readonly optionType: "P" | "C" | null; //put / call
    readonly expirationDate: NullableDate;
    readonly strikePrice: NullableNumber;
    readonly daysToExpiration: NullableNumber;
    readonly bidPrice: NullableNumber;
    readonly askPrice: NullableNumber;



    //readonly action: string;
    //readonly tradePrice: string;

}