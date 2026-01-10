import { ITickersService } from "./tickers/tickers.service.interface";
import {IServiceFactory} from "./service-factory.interface";
import {Lazy} from "../utils/lazy";
import {TickersService} from "./tickers/tickers.service";
import {ISettingsService} from "./settings/settings.service.interface";
import {SettingsService} from "./settings/settings.service";
import {IMarketDataProviderService} from "./market-data-provider/market-data-provider.service.interface";
import {MarketDataProviderService} from "./market-data-provider/market-data-provider.service";
import {ILanguageService} from "./language/language.service.interface";
import {LanguageService} from "./language/language.service";
import {ILoggerService} from "./logger/logger.service.interface";
import {ConsoleLoggerService} from "./logger/console-logger.service";
import {IBrokerAccountService} from "./broker-account/broker-account.service.interface";
import {BrokerAccountService} from "./broker-account/broker-account.service";

export class ServiceFactory implements IServiceFactory {

    constructor() {

        this._brokerAccount.forceInit();
    }

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

    private _language: Lazy<ILanguageService> = new Lazy<ILanguageService>(() => new LanguageService());
    get language(): ILanguageService {
        return this._language.value;
    }

    private _logger: Lazy<ILoggerService> = new Lazy<ILoggerService>(() => new ConsoleLoggerService());
    get logger(): ILoggerService {
        return this._logger.value;
    }

    private _brokerAccount: Lazy<IBrokerAccountService> = new Lazy<IBrokerAccountService>(() => new BrokerAccountService(this));
    get brokerAccount(): IBrokerAccountService {
        return this._brokerAccount.value;
    }


}