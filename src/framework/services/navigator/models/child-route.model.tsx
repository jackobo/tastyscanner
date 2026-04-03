import React from "react";
import {RouteBaseModel} from "./route-base.model";
import {IRouteActivationOptions} from "../navigator.service.interface";
import {IRouteOptions} from "./route.interface";

export class ChildRouteModel<TRouteParams  extends Record<string, string>> extends RouteBaseModel<TRouteParams> {
    constructor(options: IRouteOptions,
                parent: RouteBaseModel,
                private renderComponent: (routeParams: TRouteParams | null) => React.ReactElement,
                activateOptions?: IRouteActivationOptions<TRouteParams>) {
        super(options, parent.services, parent, activateOptions);
    }

    render() {
        return (
            <React.Fragment key={this.path}>
                {this.renderComponent(this.currentRouteParams)}
            </React.Fragment>
        );
    }
}
