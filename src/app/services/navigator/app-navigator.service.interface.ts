import {INavigatorService} from "../../../framework/services/navigator/navigator.service.interface";
import {IApplicationRoutes} from "./routes/application-routes.interface";

export interface IAppNavigatorService extends INavigatorService {
    readonly routes: IApplicationRoutes;
}