import {IFrameworkServiceFactory} from "./framework-service-factory.interface";
import {Lazy} from "../utils/lazy";
import {ILoggerService} from "./logger/logger.service.interface";
import {ConsoleLoggerService} from "./logger/console-logger.service";
import {LocalStorageService} from "./storage/local-storage/local-storage.service";
import {SessionStorageService} from "./storage/session-storage/session-storage.service";
import {ILanguageService} from "./language/language.service.interface";
import {LanguageService} from "./language/language.service";
import {INavigatorService} from "./navigator/navigator.service.interface";
import {IDocumentService} from "./document/document.service.interface";
import {DocumentService} from "./document/document.service";
import {IDialogService} from "./dialog/dialog.service.interface";
import {DialogService} from "./dialog/dialog.service";
import {IAlertService} from "./alert/alert.service.interface";
import {AlertService} from "./alert/alert.service";
import {ILoadingIndicatorService} from "./loading-indicator/loading-indicator.service.interface";
import {LoadingIndicatorService} from "./loading-indicator/loading-indicator.service";
import {ITimeService} from "./time/time.service.interface";
import {TimeService} from "./time/time.service";
import {IToasterService} from "./toaster/toaster.service.interface";
import {ToasterService} from "./toaster/toaster.service";
import {IStorageService} from "./storage/storage.service.interface";
import {FrameworkLocalStorageKeys} from "./storage/local-storage/framework-local-storage-keys";
import {FrameworkSessionStorageKeys} from "./storage/session-storage/framework-session-storage-keys";
import {IRightSideMenuService} from "./side-menu/right/right-side-menu.service.interface";
import {RightSideMenuService} from "./side-menu/right/right-side-menu.service";
import {ILeftSideMenuService} from "./side-menu/left/left-side-menu.service.interface";
import {IMediaChecks} from "./media-query/media-queries.interface";
import {ScreenMediaQueryChecks} from "./media-query/screen/screen-media-query-checks";
import {IFrameworkThemeService} from "./theme/framework-theme.service.interface";
import {FrameworkTheme} from "./theme/framework-theme";
import {IUserService} from "./user/user.service.interface";
import {UserService} from "./user/user.service";

export abstract class FrameworkServiceFactory implements IFrameworkServiceFactory {
    private _logger: Lazy<ILoggerService> = new Lazy<ILoggerService>(() => new ConsoleLoggerService());
    get logger(): ILoggerService {
        return this._logger.value;
    }

    abstract get navigator(): INavigatorService;
    abstract get leftSideMenu(): ILeftSideMenuService;
    abstract get theme(): IFrameworkThemeService<FrameworkTheme>;

    private _user: Lazy<IUserService> = new Lazy<IUserService>(() => new UserService(this));
    get user(): IUserService {
        return this._user.value;
    }

    private _frameworkLocalStorage: Lazy<IStorageService<FrameworkLocalStorageKeys>> = new Lazy<IStorageService<FrameworkLocalStorageKeys>>(() => new LocalStorageService<FrameworkLocalStorageKeys>());
    get frameworkLocalStorage(): IStorageService<FrameworkLocalStorageKeys> {
        return this._frameworkLocalStorage.value;
    }

    private _frameworkSessionStorage: Lazy<IStorageService<FrameworkSessionStorageKeys>> = new Lazy<IStorageService<FrameworkSessionStorageKeys>>(() => new SessionStorageService<FrameworkSessionStorageKeys>());
    get frameworkSessionStorage(): IStorageService<FrameworkSessionStorageKeys> {
        return this._frameworkSessionStorage.value;
    }

    private _language: Lazy<ILanguageService> = new Lazy<ILanguageService>(() => new LanguageService());
    get language(): ILanguageService {
        return this._language.value;
    }

    private _document: Lazy<IDocumentService> = new Lazy<IDocumentService>(() => new DocumentService());
    get document(): IDocumentService {
        return this._document.value;
    }

    private _dialog: Lazy<IDialogService> = new Lazy<IDialogService>(() => new DialogService(this));
    get dialog(): IDialogService {
        return this._dialog.value;
    }

    private _alert: Lazy<IAlertService> = new Lazy<IAlertService>(() => new AlertService(this));
    get alert(): IAlertService {
        return this._alert.value;
    }

    private _loadingIndicator: Lazy<ILoadingIndicatorService> = new Lazy<ILoadingIndicatorService>(() => new LoadingIndicatorService(this));
    get loadingIndicator(): ILoadingIndicatorService {
        return this._loadingIndicator.value;
    }

    private _time: Lazy<ITimeService> = new Lazy<ITimeService>(() => new TimeService(this));
    get time(): ITimeService {
        return this._time.value;
    }

    private _toaster: Lazy<IToasterService> = new Lazy(() => {
        return new ToasterService();
    });
    public get toaster(): IToasterService {
        return this._toaster.value;
    }

    private _rightSideMenu: Lazy<IRightSideMenuService> = new Lazy(() => {
        return new RightSideMenuService(this);
    });
    public get rightSideMenu(): IRightSideMenuService {
        return this._rightSideMenu.value;
    }

    private _screenMediaQuery: Lazy<IMediaChecks> = new Lazy<ScreenMediaQueryChecks>(() => new ScreenMediaQueryChecks());
    get screenMediaQuery(): IMediaChecks {
        return this._screenMediaQuery.value;
    }
}