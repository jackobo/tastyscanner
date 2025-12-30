import { IOptionsChainService } from "./options-chain/options-chain.service.interface";
import {IServiceFactory} from "./service-factory.interface";
import {Lazy} from "../utils/lazy";
import {OptionsChainService} from "./options-chain/options-chain.service";

export class ServiceFactory implements IServiceFactory {
    private _optionsChains: Lazy<IOptionsChainService> = new Lazy<IOptionsChainService>(() => new OptionsChainService());

    get optionsChains(): IOptionsChainService {
        return this._optionsChains.value;
    }

}