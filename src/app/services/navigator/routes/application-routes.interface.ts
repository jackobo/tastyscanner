import {
    IApplicationRoutesBase
} from "../../../../framework/services/navigator/models/application-routes-base.interface";
import {IRoute} from "../../../../framework/services/navigator/models/route.interface";
import {IStrategiesRoutes} from "./strategies/strategies.routes.interface";

export interface IApplicationRoutes extends IApplicationRoutesBase {
    strategies: IStrategiesRoutes;
    activePositions: IRoute
    workingOrders: IRoute
    chart: IRoute;
}

