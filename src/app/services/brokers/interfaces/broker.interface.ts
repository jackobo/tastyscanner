import {IBrokerageAccountModel} from "./brokerage-account.view-model.interface";
import {IDisposableAsync} from "../../../../framework/services/disposable.interface";


export interface IBroker extends IDisposableAsync {
    readonly name: string;
    readonly accounts: IBrokerageAccountModel[];
    waitForAccountsLoading(): Promise<void>;
}



