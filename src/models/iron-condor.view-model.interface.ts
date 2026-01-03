import {IOptionViewModel} from "./option.view-model.interface";
import {ITransactionViewModel} from "./transaction.view-model.interface";

export interface IIronCondorViewModel extends ITransactionViewModel {
    readonly btoPut: IOptionViewModel;
    readonly stoPut: IOptionViewModel;
    readonly stoCall: IOptionViewModel;
    readonly btoCall: IOptionViewModel;
}