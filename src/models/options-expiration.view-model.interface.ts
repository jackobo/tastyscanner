import {IOptionStrikeViewModel} from "./option-strike.view-model.interface";

export interface IOptionsExpirationVewModel {
    readonly expirationDate: string;
    readonly daysToExpiration: number;
    readonly expirationType: string;
    readonly strikes: IOptionStrikeViewModel[];
}