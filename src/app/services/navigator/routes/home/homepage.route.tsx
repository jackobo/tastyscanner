import React from "react";
import {RootRouteModel} from "../../../../../framework/services/navigator/models/root-route.model";

import {IFrameworkServiceFactory} from "../../../../../framework/services/framework-service-factory.interface";
import {IronCondorsPage} from "../../../../pages/strategies/iron-condors.page";


export class HomepageRoute extends RootRouteModel {
    constructor(services: IFrameworkServiceFactory) {
        super('/', services, () => <IronCondorsPage/>);
    }

    get isHome(): boolean {
        return true;
    }
}
