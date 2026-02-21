import React from "react";
import {IRouteActivationOptions} from "../navigator.service.interface";
import {matchPath} from "react-router";
import {IRoute} from "./route.interface";
import {NullableString} from "../../../types/nullable-types";
import {Check} from "../../../utils/type-checking";
import {makeObservable, observable, runInAction} from "mobx";
import {IFrameworkServiceFactory} from "../../framework-service-factory.interface";

export abstract class RouteBaseModel<TRouteParams extends Record<string, string> = {}> implements IRoute<TRouteParams> {
    constructor(private readonly _path: string,
                public readonly services: IFrameworkServiceFactory,
                private readonly _parent?: RouteBaseModel | null,
                private readonly _activateOptions?: IRouteActivationOptions<TRouteParams>) {
        makeObservable<this, '_currentRouteParams'>(this, {
            _currentRouteParams: observable.ref
        });
    }

    abstract render(): React.ReactElement | null;

    get path(): string {
        if(this._parent) {
            return this._parent.path + this._path;
        } else {
            return this._path;
        }
    }

    get analyticsName(): NullableString | undefined {
        return  this.path.split("/").pop();
    }

    private _currentRouteParams: TRouteParams = ({} as any);
    get currentRouteParams(): TRouteParams {
        return this._currentRouteParams;
    }

    set currentRouteParams(params: TRouteParams) {
        runInAction(() => {
            this._currentRouteParams = params;
        })
    }

    activate(activateOptions?: IRouteActivationOptions<TRouteParams>): void {
        activateOptions = {
            ...this._activateOptions,
            ...activateOptions
        };

        const routeParams = activateOptions?.routeParams ??  ({} as any)


        let path = this.path;
        Object.keys(routeParams).forEach(paramName => {
            path = path.replace(`/:${paramName}`, '/' + routeParams[paramName].toString());
        });

        let allowBack = true;
        if(activateOptions && !Check.isNullOrUndefined(activateOptions.allowBack)) {
            allowBack = activateOptions.allowBack;
        }

        if(activateOptions?.useHistoryReplace) {
            this.services.navigator.replace(path, {
                allowBack: allowBack
            });
        } else {
            this.services.navigator.push(path, {
                allowBack: allowBack
            });
        }

        this.currentRouteParams = routeParams;


    }

    get isActive(): boolean {
        return this.services.navigator.currentRoute.equals(this);
    }

    get isHome(): boolean {
        return false;
    }

    get hasActiveChildRoute(): boolean {
        return false;
    }

    equals(otherRoute: IRoute): boolean {
        if(Check.isNullOrUndefined(otherRoute)) {
            return false;
        }

        return this.path.toLowerCase() === otherRoute.path.toLowerCase();
    }

    matchLocation(pathName: string): IRoute | null  {
        const match = matchPath<TRouteParams>(pathName, {
            path: this.path,
            exact: true,
            strict: false
        });

        if(match) {
            this.currentRouteParams = match.params;
            return this;
        }

        return null;
    }
}
