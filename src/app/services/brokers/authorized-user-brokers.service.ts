import {AppServiceBase} from "../app-service-base";
import {IBrokerageAccountSettingsFields, IBrokersService} from "./brokers.service.interface";
import {IAppServiceFactory} from "../app-service-factory.interface";
import {IBroker} from "./interfaces/broker.interface";
import {computed, makeObservable, observable, runInAction} from "mobx";
import {FormFields} from "../../../framework/models/forms/form-field.interface";
import {AppLocalStorageKeys} from "../storage/app-local-storage-keys";
import {AppFormModel} from "../../models/forms/app-form.model";
import {IBrokerageAccountModel} from "./interfaces/brokerage-account.view-model.interface";
import {TimeSpan} from "../../../framework/types/time-span";

export const WORKING_ORDERS_MAX_AUTO_REPLACE_TIME_INTERVAL = TimeSpan.fromSeconds(5);

export class AuthorizedUserBrokersService extends AppServiceBase implements IBrokersService {
    constructor(services: IAppServiceFactory, private readonly brokers: Array<() => IBroker>) {
        super(services);

        makeObservable(this, {
            accounts: computed,
            currentAccount: observable.ref,
            accountsLoadingInProgress: observable.ref
        });

        this._form =  new BrokerageAccountSettingsForm(this.services);

        this._form.fields.lastUsedAccountId.onChange(async (value) => {
            if(value) {
                await this.setCurrentAccount(value);
            }
        });

        this._loadAccounts().finally(() => {
            runInAction(() => {
                this.accountsLoadingInProgress = false
            });
            this._startAutoReplaceWorkingOrders();
        });

    }


    private readonly _form: BrokerageAccountSettingsForm;

    get accounts(): IBrokerageAccountModel[] {
        return this.brokers.selectMany(b => b().accounts);
    }

    currentAccount: IBrokerageAccountModel | null = null;

    accountsLoadingInProgress: boolean = true;

    get fields(): FormFields<IBrokerageAccountSettingsFields> {
        return this._form.fields;
    }

    async setCurrentAccount(id: string): Promise<void> {

        if(this.currentAccount?.id === id) {
            return;
        }

        const newAccount = this.accounts.find(acc => acc.id === id) ?? null;

        if(!newAccount) {
            return;
        }

        if(this.currentAccount) {
            try {
                await this.currentAccount.disconnect();
            } catch (err) {
                this.services.logger.error(`Failed to dispose account: ${this.currentAccount.id}`, err);
            }

        }


        try {
            await newAccount.connect();
        } catch (err) {
            this.services.logger.error(`Failed to initialize account: ${newAccount.id}`, err);
            await this.services.toaster.showErrorToast({
                renderContent: () => this.services.language.translationFor('Failed to initialize account: {account}')
                    .withParams({account: newAccount.id})
            });
            return;
        }


        runInAction(() => {
            this.currentAccount = newAccount;
        });

        this.services.localStorage.setItem(AppLocalStorageKeys.currentBrokerAccount, newAccount.id);
    }


    private async _loadAccounts(): Promise<void> {
        await Promise.all(this.brokers.map(b => b().waitForAccountsLoading()));
        const lastUsedAccount = this.services.localStorage.getItem(AppLocalStorageKeys.currentBrokerAccount);
        if (lastUsedAccount) {
            await this.setCurrentAccount(lastUsedAccount);
        }

        if (!this.currentAccount) {
            const accountId = this.accounts[0]?.id;
            if(!accountId) {
                return;
            }
            await this.setCurrentAccount(accountId);
        }


        this._form.fields.lastUsedAccountId.setValue(this.currentAccount?.id ?? null);
        this._form.commitChanges();
    }

    private _startAutoReplaceWorkingOrders(): void {
        //this random stuff is to reduce the likelihood that multiple browser tabs to execute the order replacement at the same time
        const timeIntervalMS = Math.max(1000, Math.round(Math.random() * WORKING_ORDERS_MAX_AUTO_REPLACE_TIME_INTERVAL.totalMilliseconds));
        setTimeout(async () => {
            if(this.currentAccount) {
                const workingOrders = this.currentAccount.workingOrders.filter(wo => wo.isGobyOrder);

                for(const workingOrder of workingOrders) {
                    await workingOrder.startAutoReplace();
                }
                this._startAutoReplaceWorkingOrders();
            }
        }, timeIntervalMS);
    }

    async dispose(): Promise<void> {
        runInAction(() => {
            this.currentAccount = null;
        })
        for(const broker of this.brokers) {
            broker().dispose();
        }
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

        fields.lastUsedAccountId.onChange(async (value) => {
            if(value) {
                await this.services.brokers.setCurrentAccount(value);
                this.commitChanges();
            }
        })
    }

}