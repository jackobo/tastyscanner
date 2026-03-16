import {NullableDate, NullableNumber} from "../../../../framework/types/nullable-types";
import {OptionType} from "../../../models/option.view-model.interface";
import {OrderSimpleLegActionType} from "./open-order-request.interface";
import {TimeSpan} from "../../../../framework/types/time-span";
import {NullablePrice, Price} from "../../../models/price/price";

export interface IWorkingOrderViewModel {
    readonly id: string;
    readonly underlyingSymbol: string;
    readonly receivedAt: Date;
    readonly tradingPrice: Price;
    readonly midPrice: NullablePrice;
    readonly isGobyOrder: boolean
    readonly legs: IWorkingOrderLegViewModel[];
    readonly timeUntilNextAutoReplace: TimeSpan | null;
    readonly numberOfAutoReplaceAttempts: number;
    readonly maxAutoReplaceAttempts: NullableNumber;
    readonly optionsTickSize: NullableNumber;
    readonly autoReplaceEnabled: boolean;
    autoReplacePaused: boolean;
    suspendAutoReplace(): void;
    resumeAutoReplace(): void;
    cancel(): Promise<void>;
    replace(newPrice: Price, options?: IReplaceWorkingOrderOptions): Promise<void>;
}

export interface IReplaceWorkingOrderOptions {
    resetAutoReplaceAttempts?: boolean;
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