import {ServiceBase} from "../service-base";
import {IBrokerAccountService, IBrokerAccountViewModel} from "./broker-account.service.interface";
import {IServiceFactory} from "../service-factory.interface";
import {makeObservable, observable, runInAction} from "mobx";
import {BrokerAccountModel} from "./broker-account.model";

export class BrokerAccountService extends ServiceBase implements IBrokerAccountService {
    constructor(services: IServiceFactory) {
        super(services);
        makeObservable(this, {
            accounts: observable.ref,
            currentAccount: observable.ref
        });
        services.marketDataProvider.getAccounts().then(accounts => {
            runInAction(() => {
                this.accounts = accounts.map(acc => new BrokerAccountModel(acc.accountNumber, services));
                const lastUsedAccount = localStorage.getItem("currentBrokerAccount");
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
            localStorage.setItem("currentBrokerAccount", this.currentAccount.accountNumber);
        }

    }
}