import {IFrameworkServiceFactory} from "./framework-service-factory.interface";

export class ServiceBase<TServiceFactory extends IFrameworkServiceFactory> {
    constructor(protected readonly services: TServiceFactory) {
    }
}