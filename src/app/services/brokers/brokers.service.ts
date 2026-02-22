import {AppServiceBase} from "../app-service-base";
import {IBrokerageAccountSettingsFields, IBrokersService} from "./brokers.service.interface";
import {IAppServiceFactory} from "../app-service-factory.interface";
import {IBroker, IBrokerageAccountViewModel} from "./interfaces/broker.interface";
import {makeObservable, observable, runInAction} from "mobx";
import {FormFields} from "../../../framework/models/forms/form-field.interface";
import {AppLocalStorageKeys} from "../storage/app-local-storage-keys";
import {AppFormModel} from "../../models/forms/app-form.model";

export class BrokersService extends AppServiceBase implements IBrokersService {
    constructor(services: IAppServiceFactory, private readonly brokers: IBroker[]) {
        super(services);

        makeObservable(this, {
            accounts: observable.ref,
            currentAccount: observable.ref,
            accountsLoadingInProgress: observable.ref
        });

        this._form =  new BrokerageAccountSettingsForm(this.services);

        this._form.fields.lastUsedAccountId.onChange((value) => {
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

    setCurrentAccount(id: string): void {
        runInAction(() => {
            this.currentAccount = this.accounts.find(acc => acc.id === id) ?? null;
        });

        if (this.currentAccount) {
            this.services.localStorage.setItem(AppLocalStorageKeys.currentBrokerAccount, this.currentAccount.id);
        }
    }


    private async _loadAccounts(): Promise<void> {
        const accounts = await this._getAllAccounts();

        runInAction(() => {
            this.accounts = accounts;
            const lastUsedAccount = this.services.localStorage.getItem(AppLocalStorageKeys.currentBrokerAccount);
            if (lastUsedAccount) {
                this.setCurrentAccount(lastUsedAccount);
            }

            if (!this.currentAccount) {
                this.currentAccount = this.accounts[0] ?? null;
            }
            this._form.fields.lastUsedAccountId.setValue(this.currentAccount?.id ?? null);
            this._form.commitChanges();
        })
    }

    private async _getAllAccounts(): Promise<IBrokerageAccountViewModel[]> {
        const result: IBrokerageAccountViewModel[] = [];
        for(const broker of this.brokers) {
            try {
                result.push(...(await broker.getAccounts()));
            } catch (err) {
                this.services.logger.error(`Failed to read accounts from broker: ${broker.name}`, err);
                await this.services.toaster.showErrorToast({
                    renderContent: () => this.services.language.translationFor('Failed to read accounts from {broker} broker')
                        .withParams({broker: broker.name})
                });
            }

        }
        return result;
    }
}

class BrokerageAccountSettingsForm extends AppFormModel<IBrokerageAccountSettingsFields> {
    protected _createFields(): FormFields<IBrokerageAccountSettingsFields> {
        return {
            lastUsedAccountId: this._createField<string>({
                fieldName: () => this.services.language.translate('Current account'),
            })
        };
    }

    protected _onFieldsCreated(fields: FormFields<IBrokerageAccountSettingsFields>) {
        super._onFieldsCreated(fields);

        fields.lastUsedAccountId.onChange((value) => {
            if(value) {
                this.services.brokers.setCurrentAccount(value);
                this.commitChanges();
            }
        })
    }

}