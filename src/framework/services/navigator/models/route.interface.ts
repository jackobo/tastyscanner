import React from "react";
import {IRouteActivationOptions} from "../navigator.service.interface";
import {NullableString} from "../../../types/nullable-types";


export interface IRoute<TRouteParams extends Record<string, string> = {}> {
    readonly isActive: boolean;
    readonly isHome: boolean;
    readonly hasActiveChildRoute: boolean;
    readonly currentRouteParams: TRouteParams;
    readonly path: string;
    readonly analyticsName?: NullableString;
    readonly requireAuthentication: boolean;
    activate(activateOptions?: IRouteActivationOptions<TRouteParams>): void;
    equals(otherRoute: IRoute): boolean
    matchLocation(location: string): IRoute | null;
    render(): React.ReactElement | null;
}

export interface IRouteOptions {
    path: string;
    requireAuthentication: boolean;
}