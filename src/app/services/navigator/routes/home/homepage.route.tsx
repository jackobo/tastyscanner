import React from "react";
import {RootRouteModel} from "../../../../../framework/services/navigator/models/root-route.model";

import {IFrameworkServiceFactory} from "../../../../../framework/services/framework-service-factory.interface";
import {HomePage} from "../../../../pages/home/home.page";


export class HomepageRoute extends RootRouteModel {
    constructor(services: IFrameworkServiceFactory) {
        super({path: '/', requireAuthentication: false}, services, () => <HomePage/>);
    }

    get isHome(): boolean {
        return true;
    }
}
