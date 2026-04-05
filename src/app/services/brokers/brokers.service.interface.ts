import {FormFields} from "../../../framework/models/forms/form-field.interface";
import {IBrokerageAccountViewModel} from "./interfaces/brokerage-account.view-model.interface";
import {IDisposableAsync} from "../../../framework/services/disposable.interface";


export interface IBrokersService extends IDisposableAsync {
    readonly accounts: IBrokerageAccountViewModel[];
    readonly currentAccount: IBrokerageAccountViewModel | null;
    readonly fields: FormFields<IBrokerageAccountSettingsFields>;
    readonly accountsLoadingInProgress: boolean
    setCurrentAccount(id: string): Promise<void>;
}

export interface IBrokerageAccountSettingsFields {
    lastUsedAccountId: string;
}

