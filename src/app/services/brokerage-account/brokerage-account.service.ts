import {AppServiceBase} from "../app-service-base";
import {
    IBrokerageAccountService,
    IBrokerageAccountSettingsFields,
    IBrokerageAccountViewModel
} from "./brokerage-account.service.interface";
import {IAppServiceFactory} from "../app-service-factory.interface";
import {makeObservable, observable, runInAction} from "mobx";
import {BrokerageAccountModel} from "./brokerage-account.model";
import {AppLocalStorageKeys} from "../storage/app-local-storage-keys";
import {AppFormModel} from "../../models/forms/app-form.model";
import {FormFields} from "../../../framework/models/forms/form-field.interface";

export class BrokerageAccountService extends AppServiceBase implements IBrokerageAccountService {
    constructor(services: IAppServiceFactory) {
        super(services);
        makeObservable(this, {
            accounts: observable.ref,
            currentAccount: observable.ref
        });

        this._form =  new BrokerageAccountSettingsForm(this.services);

        this._form.fields.accountNumber.onChange((value) => {
            if(value) {
                this.setCurrentAccount(value);
            }
        })

        services.marketDataProvider.getAccounts().then(accounts => {
            runInAction(() => {
                this.accounts = accounts.map(acc => new BrokerageAccountModel(acc.accountNumber, services));
                const lastUsedAccount = services.localStorage.getItem(AppLocalStorageKeys.currentBrokerAccount);
                if (lastUsedAccount) {
                    this.setCurrentAccount(lastUsedAccount);
                }

                if (!this.currentAccount) {
                    this.currentAccount = this.accounts[0] ?? null;
                }
                this._form.fields.accountNumber.setValue(this.currentAccount?.accountNumber ?? null);
                this._form.commitChanges();
            })
        });
    }

    private readonly _form: BrokerageAccountSettingsForm;

    accounts: BrokerageAccountModel[] = [];

    currentAccount: IBrokerageAccountViewModel | null = null;

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
}

class BrokerageAccountSettingsForm extends AppFormModel<IBrokerageAccountSettingsFields> {
    protected _createFields(): FormFields<IBrokerageAccountSettingsFields> {
        return {
            accountNumber: this._createField<string>({
                fieldName: () => this.services.language.translate('Account number'),
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