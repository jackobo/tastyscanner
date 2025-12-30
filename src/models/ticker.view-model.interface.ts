import {IOptionsExpirationVewModel} from "./options-expiration.view-model.interface";

export interface ITickerViewModel {
    readonly symbol: string;
    readonly currentPrice: number;
    readonly expirations: IOptionsExpirationVewModel[];
}