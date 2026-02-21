import {AppTheme} from "./app-theme";

declare module 'styled-components' {
    export interface DefaultTheme extends AppTheme {
    }
}
