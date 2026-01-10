import {IBrokerAccountViewModel} from "./broker-account.service.interface";
import {IServiceFactory} from "../service-factory.interface";

export class BrokerAccountModel implements IBrokerAccountViewModel {
    constructor(public readonly accountNumber: string, private readonly services: IServiceFactory) {
    }
}