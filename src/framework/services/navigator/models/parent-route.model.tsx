import React from "react";
import {RouteBaseModel} from "./route-base.model";
import {IRouteActivationOptions} from "../navigator.service.interface";
import {IRoute} from "./route.interface";


export abstract class ParentRouteModel extends RouteBaseModel {

    protected abstract _getDefaultChildRoute(): RouteBaseModel | null;

    private _childRoutes: RouteBaseModel[] | null = null;
    get childRoutes(): RouteBaseModel[] {
        if(!this._childRoutes) {
            this._childRoutes = Object.keys(this)
                .map(propertyName => (this as any)[propertyName] as RouteBaseModel)
                .filter(route => route instanceof RouteBaseModel);
        }

        return this._childRoutes;
    }

    get hasActiveChildRoute(): boolean {
        return this.childRoutes.some(r => r.isActive);
    }


    activate(activateOptions?: IRouteActivationOptions) {
        const route = this._getDefaultChildRoute();
        if(route) {
            route.activate(activateOptions);
        }
    }


    render(): React.ReactElement | null {
        const defaultRoute = this._getDefaultChildRoute();
        if(defaultRoute) {
            return defaultRoute.render();
        }

        return null;


    }

    matchLocation(pathName: string): IRoute | null {
        for(const childRoute of this.childRoutes) {
            const match = childRoute.matchLocation(pathName);
            if(match) {
                return match;
            }
        }
        return null;
    }
}
