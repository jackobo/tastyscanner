import {FrameworkThemeService} from "../../../framework/services/theme/framework-theme.service";
import {AppTheme} from "../../theme/app-theme";
import {ScreenMediaQueries} from "../../../framework/services/media-query/screen/screen-media-queries";
import {makeAssets} from "../../theme/make-assets";
import {IAssetResolver} from "../../theme/asset-resolver.interface";

export class AppThemeService extends FrameworkThemeService<AppTheme> implements IAssetResolver {
    constructor() {
        super();
        this._currentTheme = {
            screenMediaQuery: ScreenMediaQueries,
            containerMediaQuery: ScreenMediaQueries,
            assets: makeAssets(this)
        };
    }

    resolveAssetPath(relativePath: string, supportedLocalizations: string[]): string {
        const assetUrl = new URL(window.location.origin);
        const currentLanguage = "en-gb";
        if(0 <= supportedLocalizations.findIndex(l => l === currentLanguage)) {
            assetUrl.pathname = `/assets/localized/${currentLanguage}/${relativePath}`;
        } else {
            assetUrl.pathname = `/assets/defaults/${relativePath}`;
        }

        return assetUrl.href;
    }

    private readonly _currentTheme: AppTheme;
    get currentTheme(): AppTheme {
        return this._currentTheme;
    }

}