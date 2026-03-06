import {IBrokerageAccountModel} from "./brokerage-account.view-model.interface";


export interface IBroker {
    readonly name: string;
    readonly accounts: IBrokerageAccountModel[];
    waitForAccountsLoading(): Promise<void>;
}



