import {RootRouteModel} from "../../../../../framework/services/navigator/models/root-route.model";
import {IFrameworkServiceFactory} from "../../../../../framework/services/framework-service-factory.interface";

import React from "react";
import {ActivePositionsPage} from "../../../../pages/active-positions/active-positions.page";

export class ActivePositionsRoute extends RootRouteModel {
    constructor(services: IFrameworkServiceFactory) {
        super('/active-positions', services, () => <ActivePositionsPage/>);
    }
}
