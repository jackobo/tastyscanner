import {NullableDate, NullableNumber} from "../../../../framework/types/nullable-types";
import {OptionType} from "../../../models/option.view-model.interface";
import {OrderSimpleLegActionType} from "./open-order-request.interface";

export interface IWorkingOrderViewModel {
    readonly id: string;
    readonly underlyingSymbol: string;
    readonly tradingPrice: number;
    readonly midPrice: NullableNumber;
    readonly isGobyOrder: boolean
    readonly legs: IWorkingOrderLegViewModel[];
    cancel(): Promise<void>;
}

export interface IWorkingOrderLegViewModel {
    readonly key: string;
    readonly isSell: boolean;
    readonly isBuy: boolean;
    readonly quantity: number;
    readonly actionType: OrderSimpleLegActionType | null;
    readonly expirationDate: NullableDate;
    readonly daysToExpiration: NullableNumber;
    readonly strikePrice: NullableNumber;
    readonly optionType: OptionType | null;



}