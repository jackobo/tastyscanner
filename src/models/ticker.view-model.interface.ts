import {IOptionsExpirationVewModel} from "./options-expiration.view-model.interface";

export interface ITickerViewModel {
    readonly symbol: string;
    readonly currentPrice: number;
    readonly ivRank: number;
    readonly beta: number;
    readonly isLoading: boolean;
    readonly expirations: IOptionsExpirationVewModel[];
    getExpirationsWithIronCondors(): IOptionsExpirationVewModel[];
    getExpirationsWithPutCreditSpreads(): IOptionsExpirationVewModel[];
    getExpirationsWithCallCreditSpreads(): IOptionsExpirationVewModel[];
}