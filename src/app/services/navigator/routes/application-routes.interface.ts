import {
    IApplicationRoutesBase
} from "../../../../framework/services/navigator/models/application-routes-base.interface";
import {IRoute} from "../../../../framework/services/navigator/models/route.interface";

export interface IApplicationRoutes extends IApplicationRoutesBase {
    activePositions: IRoute
    workingOrders: IRoute
    chart: IRoute;
}

