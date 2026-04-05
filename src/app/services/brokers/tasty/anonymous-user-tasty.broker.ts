import {
    AnonymousUserMarketDataProviderService
} from "../../market-data-provider/anonymous-user-market-data-provider.service";
import {ITastyBroker} from "./tasty-broker.interface";
import {IBrokerageAccountModel} from "../interfaces/brokerage-account.view-model.interface";

export class AnonymousUserTastyBroker extends AnonymousUserMarketDataProviderService implements ITastyBroker {
    readonly accounts: IBrokerageAccountModel[] = [];
    readonly name: string = 'Anonymous Tasty';

     waitForAccountsLoading(): Promise<void> {
        return Promise.resolve();
    }

}