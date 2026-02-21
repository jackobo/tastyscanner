import {RouteBaseModel} from "../../../../framework/services/navigator/models/route-base.model";
import {HomepageRoute} from "./home/homepage.route";
import {IApplicationRoutes} from "./application-routes.interface";
import {ApplicationRoutesBase} from "../../../../framework/services/navigator/models/application-routes-base";
import {OpenPositionsRoute} from "./open-positions/open-positions.route";

export class ApplicationRoutes extends ApplicationRoutesBase implements IApplicationRoutes {
    home = new HomepageRoute(this.services);
    openPositions = new OpenPositionsRoute(this.services);
    protected _getDefaultChildRoute(): RouteBaseModel | null {
        return this.home;
    }
}


