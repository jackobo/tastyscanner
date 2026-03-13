import {RouteBaseModel} from "../../../../framework/services/navigator/models/route-base.model";
import {HomepageRoute} from "./home/homepage.route";
import {IApplicationRoutes} from "./application-routes.interface";
import {ApplicationRoutesBase} from "../../../../framework/services/navigator/models/application-routes-base";
import {OpenPositionsRoute} from "./open-positions/open-positions.route";
import {ChartRoute} from "./chart/chart.route";
import {WorkingOrdersRoute} from "./working-orders/working-orders.route";

export class ApplicationRoutes extends ApplicationRoutesBase implements IApplicationRoutes {
    home = new HomepageRoute(this.services);
    openPositions = new OpenPositionsRoute(this.services);
    workingOrders = new WorkingOrdersRoute(this.services);
    chart = new ChartRoute(this.services);
    protected _getDefaultChildRoute(): RouteBaseModel | null {
        return this.home;
    }
}


