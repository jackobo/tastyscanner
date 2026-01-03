import {IOptionViewModel} from "./option.view-model.interface";
import {IStrategyViewModel} from "./strategy.view-model.interface";

export interface IIronCondorViewModel extends IStrategyViewModel {
    readonly btoPut: IOptionViewModel;
    readonly stoPut: IOptionViewModel;
    readonly stoCall: IOptionViewModel;
    readonly btoCall: IOptionViewModel;
}