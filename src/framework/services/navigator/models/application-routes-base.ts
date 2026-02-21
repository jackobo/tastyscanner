import {IApplicationRoutesBase} from "./application-routes-base.interface";
import {IRoute} from "./route.interface";
import {ParentRouteModel} from "./parent-route.model";

export abstract class ApplicationRoutesBase extends ParentRouteModel implements IApplicationRoutesBase {
    abstract get home(): IRoute;
}