import {RootRouteModel} from "../../../../../framework/services/navigator/models/root-route.model";
import {IFrameworkServiceFactory} from "../../../../../framework/services/framework-service-factory.interface";
import React from "react";
import {WorkingOrdersPage} from "../../../../pages/working-orders/working-orders.page";

export class WorkingOrdersRoute  extends RootRouteModel {
    constructor(services: IFrameworkServiceFactory) {
        super('/working-orders', services, () => <WorkingOrdersPage/>);
    }
}
