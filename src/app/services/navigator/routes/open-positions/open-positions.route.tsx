import {RootRouteModel} from "../../../../../framework/services/navigator/models/root-route.model";
import {IFrameworkServiceFactory} from "../../../../../framework/services/framework-service-factory.interface";

import React from "react";
import {OpenPositionsPage} from "../../../../pages/open-positions/open-positions.page";

export class OpenPositionsRoute  extends RootRouteModel {
    constructor(services: IFrameworkServiceFactory) {
        super('/open-positions', services, () => <OpenPositionsPage/>);
    }
}
