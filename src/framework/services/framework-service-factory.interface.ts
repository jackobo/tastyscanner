import {ILoggerService} from "./logger/logger.service.interface";
import {IDocumentService} from "./document/document.service.interface";
import {IDialogService} from "./dialog/dialog.service.interface";
import {IAlertService} from "./alert/alert.service.interface";
import {ILoadingIndicatorService} from "./loading-indicator/loading-indicator.service.interface";
import {IToasterService} from "./toaster/toaster.service.interface";
import {ITimeService} from "./time/time.service.interface";
import {ILanguageService} from "./language/language.service.interface";
import {INavigatorService} from "./navigator/navigator.service.interface";
import {IStorageService} from "./storage/storage.service.interface";
import {FrameworkLocalStorageKeys} from "./storage/local-storage/framework-local-storage-keys";
import {FrameworkSessionStorageKeys} from "./storage/session-storage/framework-session-storage-keys";
import {ILeftSideMenuService} from "./side-menu/left/left-side-menu.service.interface";
import {IRightSideMenuService} from "./side-menu/right/right-side-menu.service.interface";
import {IMediaChecks} from "./media-query/media-queries.interface";
import {IFrameworkThemeService} from "./theme/framework-theme.service.interface";
import {FrameworkTheme} from "./theme/framework-theme";

export interface IFrameworkServiceFactory {
    readonly logger: ILoggerService;
    readonly document: IDocumentService;
    readonly dialog: IDialogService;
    readonly alert: IAlertService;
    readonly loadingIndicator: ILoadingIndicatorService;
    readonly toaster: IToasterService;
    readonly time: ITimeService;
    readonly frameworkLocalStorage: IStorageService<FrameworkLocalStorageKeys>;
    readonly frameworkSessionStorage: IStorageService<FrameworkSessionStorageKeys>;
    readonly language: ILanguageService;
    readonly navigator: INavigatorService;
    readonly leftSideMenu: ILeftSideMenuService;
    readonly rightSideMenu: IRightSideMenuService;
    readonly screenMediaQuery: IMediaChecks;
    readonly theme: IFrameworkThemeService<FrameworkTheme>;

}