import { ITickersService } from "./tickers/tickers.service.interface";
import {IAppServiceFactory} from "./app-service-factory.interface";
import {TickersService} from "./tickers/tickers.service";
import {ISettingsService} from "./settings/settings.service.interface";
import {SettingsService} from "./settings/settings.service";
import {IMarketDataProviderService} from "./market-data-provider/market-data-provider.service.interface";
import {MarketDataProviderService} from "./market-data-provider/market-data-provider.service";
import {IBrokerAccountService} from "./broker-account/broker-account.service.interface";
import {BrokerAccountService} from "./broker-account/broker-account.service";
import {IStorageService} from "../../framework/services/storage/storage.service.interface";
import {AppLocalStorageKeys} from "./storage/app-local-storage-keys";
import {LocalStorageService} from "../../framework/services/storage/local-storage/local-storage.service";
import {AppSessionStorageKeys} from "./storage/app-session-storage-keys";
import {SessionStorageService} from "../../framework/services/storage/session-storage/session-storage.service";
import {IAppNavigatorService} from "./navigator/app-navigator.service.interface";
import {AppNavigatorService} from "./navigator/app-navigator.service";
import {FrameworkServiceFactory} from "../../framework/services/framework-service-factory";
import {ILeftSideMenuService} from "../../framework/services/side-menu/left/left-side-menu.service.interface";
import {LeftSideMenuService} from "./side-menu/left/left-side-menu.service";
import {Lazy} from "../../framework/utils/lazy";

export class AppServiceFactory extends FrameworkServiceFactory implements IAppServiceFactory {

    constructor() {
        super();
        this._brokerAccount.forceInit();
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

    private _tickers: Lazy<ITickersService> = new Lazy<ITickersService>(() => new TickersService(this));
    get tickers(): ITickersService {
        return this._tickers.value;
    }

    private _settings: Lazy<ISettingsService> = new Lazy<ISettingsService>(() => new SettingsService(this));
    get settings(): ISettingsService {
        return this._settings.value;
    }

    private _marketDataProvider: Lazy<IMarketDataProviderService> = new Lazy<IMarketDataProviderService>(() => new MarketDataProviderService());
    get marketDataProvider(): IMarketDataProviderService {
        return this._marketDataProvider.value;
    }

    private _brokerAccount: Lazy<IBrokerAccountService> = new Lazy<IBrokerAccountService>(() => new BrokerAccountService(this));
    get brokerAccount(): IBrokerAccountService {
        return this._brokerAccount.value;
    }


}