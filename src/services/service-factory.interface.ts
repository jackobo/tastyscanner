import {IOptionsChainService} from "./options-chain/options-chain.service.interface";
import {ISettingsService} from "./settings/settings.service.interface";

export interface IServiceFactory {
    readonly optionsChains: IOptionsChainService;
    readonly settings: ISettingsService;
}