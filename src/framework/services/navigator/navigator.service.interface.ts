import {IRoute} from "./models/route.interface";
import {Location} from "history";
import {IApplicationRoutesBase} from "./models/application-routes-base.interface";

export enum NavigationDirectionEnum {
    backward,
    forward
}

export interface IRouteState extends IPushRouteOptions {
    index: number;
}

export type RouteState = IRouteState | undefined;


export class RoutingGuardContext {
    constructor(public readonly targetLocation: Location<RouteState>,
                private readonly _navigationDirection: NavigationDirectionEnum,
                public readonly targetLocationIsHomePage: boolean ) {
    }

    get isBackwardNavigation(): boolean {
        return this._navigationDirection === NavigationDirectionEnum.backward;
    }

    get isForwardNavigation(): boolean {
        return this._navigationDirection === NavigationDirectionEnum.forward;
    }
}

export enum RoutingGuardResult {
    Allow,
    Block,
    Skip
}

export interface IRoutingGuard {
    canNavigate(context: RoutingGuardContext): Promise<RoutingGuardResult>;
}

export interface IRoutingGuardSubscription {
    unsubscribe(): void;
}

export interface IRouteActivationOptions<TRouteParams extends Record<string, string> = any> {
    allowBack?: boolean
    routeParams?: TRouteParams;
    useHistoryReplace?: boolean;
}

export interface IPushRouteOptions {
    allowBack?: boolean;
}

export interface IGoHomeOptions {
    skipRoutingGuards?: boolean;
}

export interface INavigatorService {
    readonly currentRoute: IRoute;
    readonly currentRouteDirection: NavigationDirectionEnum;
    readonly routes: IApplicationRoutesBase;
    push(path: string, options?: IPushRouteOptions): void;
    replace(path: string, options?: IPushRouteOptions): void;
    go(n: number): void;
    goBack(): void;
    goForward(): void;
    goHome(options?: IGoHomeOptions): Promise<boolean>;
    readonly canGoBack: boolean;
    registerRoutingGuard(listener: IRoutingGuard): IRoutingGuardSubscription;
    redirect(url: string): void;
    getQueryParamsValues(...paramsNames: string[]): Record<string, string>;
    removeQueryParams(...paramsNames: string[]): void;
}

