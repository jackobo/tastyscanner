import {IOptionStrikeViewModel} from "./option-strike.view-model.interface";
import {IIronCondorViewModel} from "./iron-condor.view-model.interface";
import {ICreditSpreadViewModel} from "./credit-spread.view-model.interface";
import {IOptionsStrategyWithAnnotationsViewModel} from "./options-strategy.view-model.interface";

export enum OptionExpirationTypeEnum {
    Weekly = "Weekly",
    Regular = "Regular",
    Quarterly = "Quarterly",
    EndOfMonth = "End-Of-Month"

}

export type OptionExpirationSettlementType = 'AM' | 'PM';

export interface IOptionsExpirationVewModel {
    readonly key: string;
    readonly expirationDate: Date;
    readonly daysToExpiration: number;
    readonly settlementType: OptionExpirationSettlementType;
    readonly expirationType: OptionExpirationTypeEnum;
    readonly strikes: IOptionStrikeViewModel[];
    readonly ironCondors: IOptionsStrategyWithAnnotationsViewModel<IIronCondorViewModel>[];
    readonly putCreditSpreads: IOptionsStrategyWithAnnotationsViewModel<ICreditSpreadViewModel>[];
    readonly callCreditSpreads: IOptionsStrategyWithAnnotationsViewModel<ICreditSpreadViewModel>[];
}