import {ContainerMediaQueries} from "../media-query/container/container-media-queries";
import {FrameworkTheme} from "./framework-theme";
import {IFrameworkThemeService} from "./framework-theme.service.interface";

export abstract class FrameworkThemeService<TTheme extends FrameworkTheme> implements IFrameworkThemeService<TTheme> {

    /*
    constructor() {
        this._currentTheme = {
            screenMediaQuery: ScreenMediaQueries,
            containerMediaQuery: ScreenMediaQueries
        };
    }
    
     */

    abstract get currentTheme(): TTheme;

    applyContainerMediaQueries(): TTheme {
        return {
            ...this.currentTheme,
            containerMediaQuery: ContainerMediaQueries
        }
    }

}