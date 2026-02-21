import {FrameworkTheme} from "./framework-theme";

export interface IFrameworkThemeService<TTheme extends FrameworkTheme> {
    readonly currentTheme: TTheme;
    applyContainerMediaQueries(): TTheme;
}