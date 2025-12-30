import { IOptionsChainService } from "./options-chain/options-chain.service.interface";
import {IServiceFactory} from "./service-factory.interface";
import {Lazy} from "../utils/lazy";
import {OptionsChainService} from "./options-chain/options-chain.service";
import {ISettingsService} from "./settings/settings.service.interface";
import {SettingsService} from "./settings/settings.service";

export class ServiceFactory implements IServiceFactory {
    private _optionsChains: Lazy<IOptionsChainService> = new Lazy<IOptionsChainService>(() => new OptionsChainService(this));

    get optionsChains(): IOptionsChainService {
        return this._optionsChains.value;
    }

    private _settings: Lazy<ISettingsService> = new Lazy<ISettingsService>(() => new SettingsService());

    get settings(): ISettingsService {
        return this._settings.value;
    }

}