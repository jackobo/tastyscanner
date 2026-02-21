import {AppTheme} from "../../theme/app-theme";

export interface IThemeService {
    readonly currentTheme: AppTheme;
    applyContainerMediaQueries(): AppTheme;
}