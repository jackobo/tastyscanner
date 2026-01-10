import {ITickersService} from "./tickers/tickers.service.interface";
import {ISettingsService} from "./settings/settings.service.interface";
import {IMarketDataProviderService} from "./market-data-provider/market-data-provider.service.interface";
import {ILanguageService} from "./language/language.service.interface";
import {ILoggerService} from "./logger/logger.service.interface";

export interface IServiceFactory {
    readonly tickers: ITickersService;
    readonly settings: ISettingsService;
    readonly marketDataProvider: IMarketDataProviderService;
    readonly language: ILanguageService;
    readonly logger: ILoggerService;
}