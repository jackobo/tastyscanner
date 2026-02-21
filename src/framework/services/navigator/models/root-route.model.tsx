import {RouteBaseModel} from "./route-base.model";
import {IRouteActivationOptions} from "../navigator.service.interface";
import React from "react";
import {IFrameworkServiceFactory} from "../../framework-service-factory.interface";

export class RootRouteModel<TRouteParams extends Record<string, string> = {}> extends RouteBaseModel<TRouteParams> {
    constructor(path: string,
                services: IFrameworkServiceFactory,
                private renderComponent: (routeParams?: TRouteParams) => React.ReactElement,
                activateOptions?: IRouteActivationOptions<TRouteParams>) {
        super(path, services, null, activateOptions);
    }

    render() {

        return (
            <React.Fragment key={this.path}>
                {this.renderComponent(this.currentRouteParams)}
            </React.Fragment>
        );
    }
}
