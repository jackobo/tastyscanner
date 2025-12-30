import {IOptionsChainService} from "./options-chain/options-chain.service.interface";

export interface IServiceFactory {
    readonly optionsChains: IOptionsChainService;
}