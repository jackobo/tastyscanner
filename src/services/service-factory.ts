import { ITickersService } from "./tickers/tickers.service.interface";
import {IServiceFactory} from "./service-factory.interface";
import {Lazy} from "../utils/lazy";
import {TickersService} from "./tickers/tickers.service";
import {ISettingsService} from "./settings/settings.service.interface";
import {SettingsService} from "./settings/settings.service";
import {IMarketDataProviderService} from "./market-data-privider/market-data-provider.service.interface";
import {MarketDataProviderService} from "./market-data-privider/market-data-provider.service";

export class ServiceFactory implements IServiceFactory {

    private _tickers: Lazy<ITickersService> = new Lazy<ITickersService>(() => new TickersService(this));
    get tickers(): ITickersService {
        return this._tickers.value;
    }

    private _settings: Lazy<ISettingsService> = new Lazy<ISettingsService>(() => new SettingsService());
    get settings(): ISettingsService {
        return this._settings.value;
    }

    private _marketDataProvider: Lazy<IMarketDataProviderService> = new Lazy<IMarketDataProviderService>(() => new MarketDataProviderService());
    get marketDataProvider(): IMarketDataProviderService {
        return this._marketDataProvider.value;
    }

}