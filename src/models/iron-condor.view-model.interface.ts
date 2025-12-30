import {IOptionViewModel} from "./option.view-model.interface";

export interface IIronCondorViewModel {
    readonly wingsWidth: number;
    readonly credit: number;
    readonly riskRewardRatio: number;
    readonly btoPut: IOptionViewModel;
    readonly stoPut: IOptionViewModel;
    readonly stoCall: IOptionViewModel;
    readonly btoCall: IOptionViewModel;
}