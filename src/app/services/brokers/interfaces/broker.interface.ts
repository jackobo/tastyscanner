import {IBrokerageAccountModel} from "./brokerage-account.view-model.interface";


export interface IBroker {
    readonly name: string;
    getAccounts(): Promise<IBrokerageAccountModel[]>;
}



