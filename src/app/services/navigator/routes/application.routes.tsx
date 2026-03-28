import {RouteBaseModel} from "../../../../framework/services/navigator/models/route-base.model";
import {HomepageRoute} from "./home/homepage.route";
import {IApplicationRoutes} from "./application-routes.interface";
import {ApplicationRoutesBase} from "../../../../framework/services/navigator/models/application-routes-base";
import {ActivePositionsRoute} from "./active-positions/active-positions.route";
import {ChartRoute} from "./chart/chart.route";
import {WorkingOrdersRoute} from "./working-orders/working-orders.route";
import {StrategiesRoutes} from "./strategies/strategies.routes";

export class ApplicationRoutes extends ApplicationRoutesBase implements IApplicationRoutes {
    home = new HomepageRoute(this.services);
    strategies = new StrategiesRoutes(this.services);
    activePositions = new ActivePositionsRoute(this.services);
    workingOrders = new WorkingOrdersRoute(this.services);
    chart = new ChartRoute(this.services);
    protected _getDefaultChildRoute(): RouteBaseModel | null {
        return this.home;
    }
}


