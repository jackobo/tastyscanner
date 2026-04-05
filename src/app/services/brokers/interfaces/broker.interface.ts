import {IBrokerageAccountModel} from "./brokerage-account.view-model.interface";
import {IDisposable} from "../../../../framework/services/disposable.interface";


export interface IBroker extends IDisposable {
    readonly name: string;
    readonly accounts: IBrokerageAccountModel[];
    waitForAccountsLoading(): Promise<void>;
}



