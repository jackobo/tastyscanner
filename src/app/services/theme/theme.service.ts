import { AppTheme } from "../../theme/app-theme";
import {IThemeService} from "./theme.service.interface";
import {ScreenMediaQueries} from "../../../framework/services/media-query/screen/screen-media-queries";
import {ContainerMediaQueries} from "../../../framework/services/media-query/container/container-media-queries";

export class ThemeService implements IThemeService {

    constructor() {
        this.currentTheme = {
            screenMediaQuery: ScreenMediaQueries,
            containerMediaQuery: ScreenMediaQueries
        };
    }

    readonly currentTheme: AppTheme;
    applyContainerMediaQueries(): AppTheme {
        return {
            ...this.currentTheme,
            containerMediaQuery: ContainerMediaQueries
        }
    }

}