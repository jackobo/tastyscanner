import {IOptionStrikeViewModel} from "./option-strike.view-model.interface";
import {IIronCondorViewModel} from "./iron-condor.view-model.interface";
import {ICreditSpreadViewModel} from "./credit-spread.view-model.interface";

export interface IOptionsExpirationVewModel {
    readonly expirationDate: string;
    readonly daysToExpiration: number;
    readonly expirationType: string;
    readonly strikes: IOptionStrikeViewModel[];
    readonly ironCondors: IIronCondorViewModel[];
    readonly putCreditSpreads: ICreditSpreadViewModel[];
    readonly callCreditSpreads: ICreditSpreadViewModel[];
}