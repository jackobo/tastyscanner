import {IBrokerageAccountSettingsFields, IBrokersService} from "./brokers.service.interface";
import {IBrokerageAccountViewModel} from "./interfaces/brokerage-account.view-model.interface";
import {FormFields} from "../../../framework/models/forms/form-field.interface";



export class AnonymousUserBrokersService implements IBrokersService {
    readonly accounts: IBrokerageAccountViewModel[] = [];
    readonly accountsLoadingInProgress: boolean = false;
    readonly currentAccount: IBrokerageAccountViewModel | null = null;
    get fields(): FormFields<IBrokerageAccountSettingsFields> {
        throw new Error("Operation not allowed.");
    }

    setCurrentAccount(id: string): Promise<void> {
        return Promise.resolve();
    }

    dispose(): void {
    }

}