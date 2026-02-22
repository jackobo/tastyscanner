import {AppServiceBase} from "../app-service-base";
import {
    IBrokerageAccountService,
    IBrokerageAccountSettingsFields,
    IBrokerageAccountViewModel
} from "./brokerage-account.service.interface";
import {IAppServiceFactory} from "../app-service-factory.interface";
import {makeObservable, observable, runInAction} from "mobx";
import {AppLocalStorageKeys} from "../storage/app-local-storage-keys";
import {AppFormModel} from "../../models/forms/app-form.model";
import {FormFields} from "../../../framework/models/forms/form-field.interface";


export class BrokerageAccountService extends AppServiceBase implements IBrokerageAccountService {
    constructor(services: IAppServiceFactory) {
        super(services);
        makeObservable(this, {
            accounts: observable.ref,
            currentAccount: observable.ref,
            accountsLoadingInProgress: observable.ref
        });

        this._form =  new BrokerageAccountSettingsForm(this.services);

        this._form.fields.accountNumber.onChange((value) => {
            if(value) {
                this.setCurrentAccount(value);
            }
        })

        this._loadAccounts().finally(() => {
            runInAction(() => {
                this.accountsLoadingInProgress = false
            });
        });
    }

    private readonly _form: BrokerageAccountSettingsForm;

    accounts: IBrokerageAccountViewModel[] = [];

    currentAccount: IBrokerageAccountViewModel | null = null;

    accountsLoadingInProgress: boolean = true;

    get fields(): FormFields<IBrokerageAccountSettingsFields> {
        return this._form.fields;
    }

    setCurrentAccount(accountNumber: string): void {
        runInAction(() => {
            this.currentAccount = this.accounts.find(acc => acc.accountNumber === accountNumber) ?? null;
        });

        if (this.currentAccount) {
            this.services.localStorage.setItem(AppLocalStorageKeys.currentBrokerAccount, this.currentAccount.accountNumber);
        }


    }


    private async _loadAccounts(): Promise<void> {
        const accounts = await this.services.marketDataProvider.getAccounts();

        runInAction(() => {
            this.accounts = accounts;
            const lastUsedAccount = this.services.localStorage.getItem(AppLocalStorageKeys.currentBrokerAccount);
            if (lastUsedAccount) {
                this.setCurrentAccount(lastUsedAccount);
            }

            if (!this.currentAccount) {
                this.currentAccount = this.accounts[0] ?? null;
            }
            this._form.fields.accountNumber.setValue(this.currentAccount?.accountNumber ?? null);
            this._form.commitChanges();
        })
    }
}

class BrokerageAccountSettingsForm extends AppFormModel<IBrokerageAccountSettingsFields> {
    protected _createFields(): FormFields<IBrokerageAccountSettingsFields> {
        return {
            accountNumber: this._createField<string>({
                fieldName: () => this.services.language.translate('Current account'),
            })
        };
    }

    protected _onFieldsCreated(fields: FormFields<IBrokerageAccountSettingsFields>) {
        super._onFieldsCreated(fields);

        fields.accountNumber.onChange((value) => {
            if(value) {
                this.services.brokerageAccount.setCurrentAccount(value);
                this.commitChanges();
            }
        })
    }

}