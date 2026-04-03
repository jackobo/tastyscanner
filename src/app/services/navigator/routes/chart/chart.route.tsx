import {RootRouteModel} from "../../../../../framework/services/navigator/models/root-route.model";
import {IFrameworkServiceFactory} from "../../../../../framework/services/framework-service-factory.interface";

import React from "react";
import {ChartPage} from "../../../../pages/chart/chart.page";

export class ChartRoute  extends RootRouteModel {
    constructor(services: IFrameworkServiceFactory) {
        super({path: '/chart', requireAuthentication: false}, services, () => <ChartPage/>);
    }
}
