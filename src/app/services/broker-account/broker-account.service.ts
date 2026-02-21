import {AppServiceBase} from "../app-service-base";
import {IBrokerAccountService, IBrokerAccountViewModel} from "./broker-account.service.interface";
import {IAppServiceFactory} from "../app-service-factory.interface";
import {makeObservable, observable, runInAction} from "mobx";
import {BrokerAccountModel} from "./broker-account.model";
import {AppLocalStorageKeys} from "../storage/app-local-storage-keys";

export class BrokerAccountService extends AppServiceBase implements IBrokerAccountService {
    constructor(services: IAppServiceFactory) {
        super(services);
        makeObservable(this, {
            accounts: observable.ref,
            currentAccount: observable.ref
        });
        services.marketDataProvider.getAccounts().then(accounts => {
            runInAction(() => {
                this.accounts = accounts.map(acc => new BrokerAccountModel(acc.accountNumber, services));
                const lastUsedAccount = services.localStorage.getItem(AppLocalStorageKeys.currentBrokerAccount);
                if(lastUsedAccount) {
                    this.setCurrentAccount(lastUsedAccount);
                }

                if(!this.currentAccount) {
                    this.currentAccount = this.accounts[0] ?? null;
                }

            })
        });
    }
    accounts: BrokerAccountModel[] = [];

    currentAccount: IBrokerAccountViewModel | null = null;
    setCurrentAccount(accountNumber: string): void {
        runInAction(() => {
            this.currentAccount = this.accounts.find(acc => acc.accountNumber === accountNumber) ?? null;
        });

        if(this.currentAccount) {
            this.services.localStorage.setItem(AppLocalStorageKeys.currentBrokerAccount, this.currentAccount.accountNumber);
        }

    }
}