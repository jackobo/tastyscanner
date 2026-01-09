import {IOptionStrikeViewModel} from "./option-strike.view-model.interface";
import {IIronCondorViewModel} from "./iron-condor.view-model.interface";
import {ICreditSpreadViewModel} from "./credit-spread.view-model.interface";

export enum OptionExpirationTypeEnum {
    Regular = "Regular",
    Weekly = "Weekly",

}

export interface IOptionsExpirationVewModel {
    readonly key: string;
    readonly expirationDate: string;
    readonly daysToExpiration: number;
    readonly expirationType: OptionExpirationTypeEnum;
    readonly strikes: IOptionStrikeViewModel[];
    readonly ironCondors: IIronCondorViewModel[];
    readonly putCreditSpreads: ICreditSpreadViewModel[];
    readonly callCreditSpreads: ICreditSpreadViewModel[];
}