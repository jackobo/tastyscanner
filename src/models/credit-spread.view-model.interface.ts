import {IStrategyViewModel} from "./strategy.view-model.interface";
import {IOptionViewModel} from "./option.view-model.interface";

export interface ICreditSpreadViewModel extends IStrategyViewModel {
    readonly stoOption: IOptionViewModel;
    readonly btoOption: IOptionViewModel;
}
