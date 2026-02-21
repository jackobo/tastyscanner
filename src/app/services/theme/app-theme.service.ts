import {FrameworkThemeService} from "../../../framework/services/theme/framework-theme.service";
import {AppTheme} from "../../theme/app-theme";
import {ScreenMediaQueries} from "../../../framework/services/media-query/screen/screen-media-queries";

export class AppThemeService extends FrameworkThemeService<AppTheme>{
    constructor() {
        super();
        this._currentTheme = {
            screenMediaQuery: ScreenMediaQueries,
            containerMediaQuery: ScreenMediaQueries
        };
    }

    private readonly _currentTheme: AppTheme;
    get currentTheme(): AppTheme {
        return this._currentTheme;
    }

}