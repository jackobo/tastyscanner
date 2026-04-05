import {makeObservable, observable, reaction, runInAction} from "mobx";
import {IFrameworkServiceFactory} from "./framework-service-factory.interface";
import {FrameworkServiceBase} from "./framework-service-base";
import {IDisposable} from "./disposable.interface";

export class AuthorizedServiceFactory<TServiceInterface extends IDisposable> extends FrameworkServiceBase {
    constructor(services: IFrameworkServiceFactory,
                private readonly createAuthorizesServiceInstance: () => TServiceInterface,
                private readonly createAnonymousServiceInstance: () => TServiceInterface) {
        super(services);

        reaction(() => this.services.user.isAuthenticated,
            () => {
                this._currentInstance = null;
            })

        makeObservable<this, '_currentInstance'>(this, {
            _currentInstance: observable.ref
        });

    }

    private _currentInstance: TServiceInterface | null = null;
    get currentInstance(): TServiceInterface {
        if(!this._currentInstance) {
            runInAction(() => {
                this._currentInstance = this._createCurrentInstance();
            });
        }

        return this._currentInstance!;
    }


    private _createCurrentInstance(): TServiceInterface {
        if(this.services.user.isAuthenticated) {
            return this.createAuthorizesServiceInstance();
        } else {
            return this.createAnonymousServiceInstance();
        }
    }
}