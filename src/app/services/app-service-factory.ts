import { ITickersService } from "./tickers/tickers.service.interface";
import {IAppServiceFactory} from "./app-service-factory.interface";
import {TickersService} from "./tickers/tickers.service";
import {IStrategySettingsService} from "./strategy-settings/strategy-settings.service.interface";
import {StrategySettingsService} from "./strategy-settings/strategy-settings.service";
import {IMarketDataProviderService} from "./market-data-provider/market-data-provider.service.interface";
import {AuthenticatedUserMarketDataProviderService} from "./market-data-provider/authenticated-user-market-data-provider.service";
import {IStorageService} from "../../framework/services/storage/storage.service.interface";
import {AppLocalStorageKeys} from "./storage/app-local-storage-keys";
import {LocalStorageService} from "../../framework/services/storage/local-storage/local-storage.service";
import {AppSessionStorageKeys} from "./storage/app-session-storage-keys";
import {SessionStorageService} from "../../framework/services/storage/session-storage/session-storage.service";
import {IAppNavigatorService} from "./navigator/app-navigator.service.interface";
import {AppNavigatorService} from "./navigator/app-navigator.service";
import {FrameworkServiceFactory} from "../../framework/services/framework-service-factory";
import {ILeftSideMenuService} from "../../framework/services/side-menu/left/left-side-menu.service.interface";
import {LeftSideMenuService} from "./side-menu/left-side-menu.service";
import {Lazy} from "../../framework/utils/lazy";
import {IAppSettingsService} from "./app-settings/app-settings.service.interface";
import {AppSettingsService} from "./app-settings/app-settings.service";
import {IFrameworkThemeService} from "../../framework/services/theme/framework-theme.service.interface";
import {AppTheme} from "../theme/app-theme";
import {AppThemeService} from "./theme/app-theme.service";
import {TastyBroker} from "./brokers/tasty/tasty.broker";
import {IBrokersService} from "./brokers/brokers.service.interface";
import {AuthorizedUserBrokersService} from "./brokers/authorized-user-brokers.service";
import {AnonymousUserBrokersService} from "./brokers/anonymous-user-brokers.service";
import {
    AnonymousUserMarketDataProviderService
} from "./market-data-provider/anonymous-user-market-data-provider.service";
import {AuthorizedServiceFactory} from "../../framework/services/authorized-service-factory";

export class AppServiceFactory extends FrameworkServiceFactory implements IAppServiceFactory {

    constructor() {
        super();
        this._appSettings.forceInit();
        this._marketDataProvider.forceInit();
        this._brokers.forceInit();

    }

    private _localStorage: Lazy<IStorageService<AppLocalStorageKeys>> = new Lazy<IStorageService<AppLocalStorageKeys>>(() => new LocalStorageService<AppLocalStorageKeys>());
    get localStorage(): IStorageService<AppLocalStorageKeys> {
        return this._localStorage.value;
    }

    private _sessionStorage: Lazy<IStorageService<AppSessionStorageKeys>> = new Lazy<IStorageService<AppSessionStorageKeys>>(() => new SessionStorageService<AppSessionStorageKeys>());
    get sessionStorage(): IStorageService<AppSessionStorageKeys> {
        return this._sessionStorage.value;
    }

    private _navigator: Lazy<IAppNavigatorService> = new Lazy<AppNavigatorService>(() => new AppNavigatorService(this));
    get navigator(): IAppNavigatorService {
        return this._navigator.value;
    }

    private _leftSideMenu: Lazy<ILeftSideMenuService> = new Lazy(() => {
        return new LeftSideMenuService(this);
    });
    public get leftSideMenu(): ILeftSideMenuService {
        return this._leftSideMenu.value;
    }

    private _theme: Lazy<IFrameworkThemeService<AppTheme>> = new Lazy<IFrameworkThemeService<AppTheme>>(() => new AppThemeService());
    get theme(): IFrameworkThemeService<AppTheme> {
        return this._theme.value;
    }


    private _tickers: Lazy<ITickersService> = new Lazy<ITickersService>(() => new TickersService(this));
    get tickers(): ITickersService {
        return this._tickers.value;
    }

    private _appSettings: Lazy<IAppSettingsService> = new Lazy<IAppSettingsService>(() => new AppSettingsService(this));
    get appSettings(): IAppSettingsService {
        return this._appSettings.value;
    }

    private _strategySettings: Lazy<IStrategySettingsService> = new Lazy<IStrategySettingsService>(() => new StrategySettingsService(this));
    get strategySettings(): IStrategySettingsService {
        return this._strategySettings.value;
    }

    private _tastyBroker: Lazy<TastyBroker> = new Lazy<TastyBroker>(() => new TastyBroker(this));

    private _marketDataProvider: Lazy<AuthorizedServiceFactory<IMarketDataProviderService>> = new Lazy<AuthorizedServiceFactory<IMarketDataProviderService>>(() => {
        return new AuthorizedServiceFactory<IMarketDataProviderService>(this,
            () => new AuthenticatedUserMarketDataProviderService(this, [this._tastyBroker.value]),
            () => new AnonymousUserMarketDataProviderService());
    });
    get marketDataProvider(): IMarketDataProviderService {
        return this._marketDataProvider.value.currentInstance;
    }

    private _brokers: Lazy<AuthorizedServiceFactory<IBrokersService>> = new Lazy<AuthorizedServiceFactory<IBrokersService>>(() => {

        return new AuthorizedServiceFactory<IBrokersService>(this,
                                                    () => new AuthorizedUserBrokersService(this, [this._tastyBroker.value]),
                                                    () => new AnonymousUserBrokersService());


    });
    get brokers(): IBrokersService {
        return this._brokers.value.currentInstance;
    }

}