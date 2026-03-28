import {ParentRouteModel} from "../../../../../framework/services/navigator/models/parent-route.model";
import {IStrategiesRoutes} from "./strategies.routes.interface";
import {RouteBaseModel} from "../../../../../framework/services/navigator/models/route-base.model";
import {ChildRouteModel} from "../../../../../framework/services/navigator/models/child-route.model";
import {CallCreditSpreadsPage} from "../../../../pages/strategies/call-credit-spreads.page";
import {IronCondorsPage} from "../../../../pages/strategies/iron-condors.page";
import {PutCreditSpreadsPage} from "../../../../pages/strategies/put-credit-spreads.page";
import {IFrameworkServiceFactory} from "../../../../../framework/services/framework-service-factory.interface";

export class StrategiesRoutes extends ParentRouteModel implements IStrategiesRoutes {
    constructor(services: IFrameworkServiceFactory) {
        super('/strategies', services);
    }
    ironCondors = new ChildRouteModel("/iron-condors", this, () => <IronCondorsPage/>)
    putCreditSpreads= new ChildRouteModel("/put-credit-spreads", this, () => <PutCreditSpreadsPage/>)
    callCreditSpreads = new ChildRouteModel("/call-credit-spreads", this, () => <CallCreditSpreadsPage/>)

    protected _getDefaultChildRoute(): RouteBaseModel | null {
        return this.ironCondors;
    }
}