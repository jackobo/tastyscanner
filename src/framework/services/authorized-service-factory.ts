import {makeObservable, observable, reaction} from "mobx";
import {IFrameworkServiceFactory} from "./framework-service-factory.interface";
import {FrameworkServiceBase} from "./framework-service-base";
import {IDisposableAsync} from "./disposable.interface";

export class AuthorizedServiceFactory<TServiceInterface extends IDisposableAsync> extends FrameworkServiceBase {
    constructor(services: IFrameworkServiceFactory,
                private readonly createAuthorizesServiceInstance: () => TServiceInterface,
                private readonly createAnonymousServiceInstance: () => TServiceInterface) {
        super(services);

        this._currentInstance = this._createCurrentInstance();

        reaction(() => this.services.user.isAuthenticated, async () => {
            await this._currentInstance.disposeAsync();
            this._currentInstance = this._createCurrentInstance();
        })

        makeObservable<this, '_currentInstance'>(this, {
            _currentInstance: observable.ref
        });

    }

    private _currentInstance: TServiceInterface;
    get currentInstance(): TServiceInterface {
        return this._currentInstance;
    }

    private _createCurrentInstance(): TServiceInterface {
        if(this.services.user.isAuthenticated) {
            return this.createAuthorizesServiceInstance();
        } else {
            return this.createAnonymousServiceInstance();
        }
    }
}