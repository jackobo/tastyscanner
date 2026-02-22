import {ITickersService} from "./tickers/tickers.service.interface";
import {IStrategySettingsService} from "./strategy-settings/strategy-settings.service.interface";
import {IMarketDataProviderService} from "./market-data-provider/market-data-provider.service.interface";
import {ILanguageService} from "../../framework/services/language/language.service.interface";
import {IFrameworkServiceFactory} from "../../framework/services/framework-service-factory.interface";
import {IAppNavigatorService} from "./navigator/app-navigator.service.interface";
import {IStorageService} from "../../framework/services/storage/storage.service.interface";
import {AppLocalStorageKeys} from "./storage/app-local-storage-keys";
import {AppSessionStorageKeys} from "./storage/app-session-storage-keys";
import {IAppSettingsService} from "./app-settings/app-settings.service.interface";
import {IFrameworkThemeService} from "../../framework/services/theme/framework-theme.service.interface";
import {AppTheme} from "../theme/app-theme";
import {IBrokersService} from "./brokers/brokers.service.interface";

export interface IAppServiceFactory extends IFrameworkServiceFactory {
    readonly localStorage: IStorageService<AppLocalStorageKeys>;
    readonly sessionStorage: IStorageService<AppSessionStorageKeys>;
    readonly navigator: IAppNavigatorService;
    readonly appSettings: IAppSettingsService;
    readonly tickers: ITickersService;
    readonly strategySettings: IStrategySettingsService;
    readonly brokers: IBrokersService;
    readonly marketDataProvider: IMarketDataProviderService;
    readonly language: ILanguageService;
    readonly theme: IFrameworkThemeService<AppTheme>;
}