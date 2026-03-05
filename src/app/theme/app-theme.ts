import 'styled-components';
import {FrameworkTheme} from "../../framework/services/theme/framework-theme";
import {makeAssets} from "./make-assets";

export interface AppTheme extends FrameworkTheme {
    assets: ReturnType<typeof makeAssets>;
}