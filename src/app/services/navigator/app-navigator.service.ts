import {NavigatorService} from "../../../framework/services/navigator/navigator.service";
import {IApplicationRoutes} from "./routes/application-routes.interface";
import {ApplicationRoutes} from "./routes/application.routes";
import {IAppNavigatorService} from "./app-navigator.service.interface";

export class AppNavigatorService extends NavigatorService<IApplicationRoutes> implements IAppNavigatorService {
    _createApplicationRoutes(): IApplicationRoutes {
        return new ApplicationRoutes("", this.services);
    }
}