import {
    IGoHomeOptions,
    INavigatorService,
    IPushRouteOptions,
    IRouteState,
    IRoutingGuard,
    IRoutingGuardSubscription,
    NavigationDirectionEnum,
    RouteState,
    RoutingGuardContext,
    RoutingGuardResult
} from "./navigator.service.interface";
import {makeObservable, observable, runInAction} from "mobx";
import {IRoute} from "./models/route.interface";
import {createBrowserHistory, History, Location} from 'history'
import {Check} from "../../utils/type-checking";
import {IFrameworkServiceFactory} from "../framework-service-factory.interface";
import {IApplicationRoutesBase} from "./models/application-routes-base.interface";
import {Lazy} from "../../utils/lazy";
import {FrameworkServiceBase} from "../framework-service-base";
import {FrameworkSessionStorageKeys} from "../storage/session-storage/framework-session-storage-keys";


interface ICurrentRouteInfo {
    currentRoute: IRoute;
    routeState: RouteState;
    direction: NavigationDirectionEnum;
}


interface IRoutingGuardContext {
    readonly targetLocation: Location<RouteState>,
    readonly navigationDirection: NavigationDirectionEnum
    readonly targetIsHomePage: boolean;
}



//https://www.npmjs.com/package/history-block-async
export abstract class NavigatorService<TAppRoutes extends IApplicationRoutesBase> extends FrameworkServiceBase implements INavigatorService{
    constructor(services: IFrameworkServiceFactory) {
        super(services);

        this._history = createBrowserHistory<RouteState>({
            getUserConfirmation: this._guardRoute
        });



        this._currentRouteInfo = this._createInitialRoute();

        makeObservable(this, {
            _currentRouteInfo: observable.ref,
        });

        this._registerHistoryHandlers();
    }

    abstract _createApplicationRoutes(): TAppRoutes;

    private readonly _history: History<RouteState>;
    private readonly _applicationRoutes: Lazy<TAppRoutes> = new Lazy<TAppRoutes>(() => this._createApplicationRoutes());
    get routes(): TAppRoutes {
        return this._applicationRoutes.value;
    }


    _currentRouteInfo: ICurrentRouteInfo;
    private _setCurrentRouteInfo(routeInfo: ICurrentRouteInfo): void {
        runInAction(() => {
            this._currentRouteInfo = routeInfo;
        });
    }

    get currentRoute(): IRoute {
        return this._currentRouteInfo.currentRoute;
    }

    get currentRouteDirection(): NavigationDirectionEnum {
        return this._currentRouteInfo.direction;
    }

    private _createInitialRoute(): ICurrentRouteInfo {
        const route = this.routes.matchLocation(this._history.location.pathname);
        if(route) {
            return {
                currentRoute: route,
                routeState: this._history.location.state,
                direction: NavigationDirectionEnum.forward
            };
        } else {
            return {
                currentRoute: this.routes.home,
                routeState: {allowBack: false, index: 0},
                direction: NavigationDirectionEnum.forward
            };
        }
    }

    private _getNextPushIndex(): number {
        const persistedCurrentIndex = this.services.frameworkSessionStorage.getItem(FrameworkSessionStorageKeys.NavigatorPushIndex);

        if(persistedCurrentIndex) {
            const newIndex = parseInt(persistedCurrentIndex) + 1;
            this.services.frameworkSessionStorage.setItem(FrameworkSessionStorageKeys.NavigatorPushIndex, newIndex.toString());
            return newIndex;
        } else {
            this.services.frameworkSessionStorage.setItem(FrameworkSessionStorageKeys.NavigatorPushIndex, "0");
            return 0;
        }
    }

    push(path: string, options?: IPushRouteOptions): void {
        if(path.toLowerCase() !== this.currentRoute.path.toLowerCase()) {
            const routeState: IRouteState = {
                ...options,
                index: this._getNextPushIndex()
            }
            this._history.push(path, routeState);

        }
    }

    replace(path: string, options?: IPushRouteOptions) {
        if(path.toLowerCase() !== this.currentRoute.path.toLowerCase()) {
            const routeState: IRouteState = {
                ...options,
                index: this._getNextPushIndex()
            }

            this._history.replace(path, routeState);
        }

    }

    get canGoBack(): boolean {
        const allowBack = this._currentRouteInfo.routeState?.allowBack;

        if(Check.isNullOrUndefined(allowBack)){
            return this._history.length > 0;
        } else {
            return this._history.length > 0 && allowBack;
        }
    }


    goBack(): void {
        this._history.goBack();
    }

    goForward(): void {
        this._history.goForward();
    }

    go(n: number): void {
        this._history.go(n);
    }


    goHome(options?: IGoHomeOptions): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            if(this.currentRoute.equals(this.routes.home)) {
                resolve(true);
            } else {
                this._skipRoutingGuards = Boolean(options?.skipRoutingGuards);
                this._routingGuardPromiseResolve = resolve;
                this.routes.home.activate();
            }
        })
    }

    private _getRoutingDirection(newLocation: Location<RouteState>): NavigationDirectionEnum {

        const newIndex = newLocation.state?.index ?? -1;
        const currentIndex = this._currentRouteInfo.routeState?.index ?? -1;
        if(newIndex <= currentIndex) {
            return NavigationDirectionEnum.backward;
        }

        return NavigationDirectionEnum.forward;
    }

    private _routingGuardPromiseResolve: null | ((value: boolean | PromiseLike<boolean>) => void) = null;
    private _skipRoutingGuards = false;
    private _preventGuardReEntrance = false;
    private _guardRoute = (message: string, callback: (result: boolean) => void) => {
        if(this._skipRoutingGuards) {
            this._skipRoutingGuards = false;
            callback(true);
            if(this._routingGuardPromiseResolve) {
                this._routingGuardPromiseResolve(true);
                this._routingGuardPromiseResolve = null;
            }
            return;
        }
        const contextData: IRoutingGuardContext = JSON.parse(message);

        const targetRoute = this.routes.matchLocation(contextData.targetLocation.pathname);
        const context = new RoutingGuardContext(contextData.targetLocation,
                                                targetRoute,
                                                contextData.navigationDirection,
                                                contextData.targetIsHomePage);

        const resolve = (canNavigate: boolean) => {

            callback(canNavigate);

            if(!canNavigate) {
                setTimeout(() => {
                    if(!this.currentRoute.matchLocation(window.location.pathname)) {
                        //We do this because if you refresh the page then on the next navigation that we try to block there is a strange behavior.
                        //The strange behavior is that the navigation is blocked from the history object point of view but the browser changes the route in the address bar anyway.
                        //The reason for this is because the history object (created in the constructor with createBrowserHistory) that we use here is not the same as the window.history object.
                        //So somehow after refresh this history object is loosing some internal state and if you try to block the next navigation will lead to this strange behavior.
                        //The setTimeout is to give a chance to the browser to change the url in order for the condition !this.currentRoute.matchLocation(window.location.pathname) to work correctly
                        this._preventGuardReEntrance = true;
                        if(context.isBackwardNavigation) {
                            window.history.go(1);
                        } else {
                            window.history.go(-1);
                        }
                    }
                }, 100);
            }

            if(this._routingGuardPromiseResolve) {
                this._routingGuardPromiseResolve(canNavigate);
                this._routingGuardPromiseResolve = null;
            }
        }

        if(context.isBackwardNavigation) {
            if(!this.canGoBack) {
                resolve(false);
                return;
            }
        }

        this._executeRoutingGuards(context).then(guardResult => {
            if(guardResult === RoutingGuardResult.Allow) {
                resolve(true);
            } else if(guardResult === RoutingGuardResult.Block) {
                resolve(false)
            } else { //skip
                resolve(true);
                if(context.isBackwardNavigation) {
                    this.go(-1);
                } else {
                    this.go(1);
                }
            }

        });
    }

    private async _executeRoutingGuards(context: RoutingGuardContext): Promise<RoutingGuardResult> {
        for(const guard of this._routingGuards) {
            const guardResult = await guard.canNavigate(context);
            if(guardResult !== RoutingGuardResult.Allow) {
                return guardResult;
            }
        }

        return RoutingGuardResult.Allow;
    }

    private _registerBlock(): void {
        this._history.block((location) => {

            if(this._preventGuardReEntrance) {
                this._preventGuardReEntrance = false;
            } else {
                const targetIsHomePage = !Check.isNullOrUndefined(this.routes.home.matchLocation(location.pathname));
                const contextData: IRoutingGuardContext = {
                    targetLocation: location,
                    navigationDirection: this._getRoutingDirection(location),
                    targetIsHomePage: targetIsHomePage
                };

                return JSON.stringify(contextData);
            }
        });
    }

    private _registerListen(): void {
        this._history.listen((location) => {
            const route = this.routes.matchLocation(location.pathname);

            if(route) {
                if(!this._currentRouteInfo.currentRoute.equals(route)) {
                    this._setCurrentRouteInfo({
                        currentRoute: route,
                        routeState: location.state,
                        direction: this._getRoutingDirection(location)
                    });
                }

            } else {
                this.goHome();
            }

        });
    }

    private _registerHistoryHandlers(): void {
        this._registerBlock();
        this._registerListen();
    }



    private _routingGuards: IRoutingGuard[] = [];
    registerRoutingGuard(listener: IRoutingGuard): IRoutingGuardSubscription {
        if(!this._routingGuards.find(l => l === listener)) {
            this._routingGuards.push(listener);
        }

        return {
            unsubscribe: () => {
                const index = this._routingGuards.findIndex(i => i === listener);
                if(index >= 0) {
                    this._routingGuards.splice(index, 1);
                }
            }
        }
    }

    redirect(url: string): void {
        window.location.href = url;
    }

    private _getUrlSearchParams(): URLSearchParams {
        return new URLSearchParams(window.location.search) as URLSearchParams;
    }

    getQueryParamsValues(...paramsNames: string[]): Record<string, string> {
        const urlSearch = this._getUrlSearchParams();
        const result: Record<string, string> = {};

        const paramsNamesCaseInsensitive = paramsNames.toDictionaryOfType(item => item.toLowerCase(), item => item);

        urlSearch.forEach((value, name) => {
            const requestedParamName = paramsNamesCaseInsensitive[name.toLowerCase()];
            if(requestedParamName) {
                result[requestedParamName] = value;
            }
        });

        return result;
    }

    removeQueryParams(...paramsNames: string[]): void {

        const paramsToRemove: string[] = [];
        const paramsNamesCaseInsensitive = paramsNames.toDictionaryOfType(item => item.toLowerCase(), item => item);

        const urlSearch = this._getUrlSearchParams();

        urlSearch.forEach((value, name) => {
            const requestedParamName = paramsNamesCaseInsensitive[name.toLowerCase()];
            if(requestedParamName) {
                paramsToRemove.push(name);
            }
        });

        if(paramsToRemove.length === 0) {
            return;
        }

        for(const p of paramsToRemove) {
            urlSearch.delete(p);
        }

        const search = urlSearch.toString();
        if(search) {
            this._history.replace(`${window.location.pathname}?${search}`);
        } else {
            this._history.replace(`${window.location.pathname}`);
        }


    }


}

