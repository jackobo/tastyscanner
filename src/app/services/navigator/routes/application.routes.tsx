import {RouteBaseModel} from "../../../../framework/services/navigator/models/route-base.model";
import {HomepageRoute} from "./home/homepage.route";
import {IApplicationRoutes} from "./application-routes.interface";
import {ApplicationRoutesBase} from "../../../../framework/services/navigator/models/application-routes-base";

export class ApplicationRoutes extends ApplicationRoutesBase implements IApplicationRoutes {
    home = new HomepageRoute(this.services);

    protected _getDefaultChildRoute(): RouteBaseModel | null {
        return null;
    }
}


