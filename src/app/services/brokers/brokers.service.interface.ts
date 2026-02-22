import {FormFields} from "../../../framework/models/forms/form-field.interface";
import {IBrokerageAccountViewModel} from "./broker.interface";

export interface IBrokersService {
    readonly accounts: IBrokerageAccountViewModel[];
    readonly currentAccount: IBrokerageAccountViewModel | null;
    readonly fields: FormFields<IBrokerageAccountSettingsFields>;
    readonly accountsLoadingInProgress: boolean
    setCurrentAccount(id: string): void;
}

export interface IBrokerageAccountSettingsFields {
    lastUsedAccountId: string;
}
