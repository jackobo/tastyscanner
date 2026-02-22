import {IBrokerageAccountViewModel} from "./brokerage-account.view-model.interface";


export interface IBroker {
    readonly name: string;
    getAccounts(): Promise<IBrokerageAccountViewModel[]>;
}



