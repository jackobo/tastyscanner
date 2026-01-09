import {IOptionsExpirationVewModel} from "./options-expiration.view-model.interface";
import {NullableNumber} from "../utils/nullable-types";

export interface ITickerViewModel {
    readonly symbol: string;
    readonly currentPrice: number;
    readonly ivRank: number;
    readonly beta: number;
    readonly isLoading: boolean;
    readonly expirations: IOptionsExpirationVewModel[];
    readonly earningsDate: string;
    readonly daysUntilEarnings: NullableNumber;
    getExpirationsWithIronCondors(): IOptionsExpirationVewModel[];
    getExpirationsWithPutCreditSpreads(): IOptionsExpirationVewModel[];
    getExpirationsWithCallCreditSpreads(): IOptionsExpirationVewModel[];
}