import {FrameworkServiceBase} from "../framework-service-base";
import {IUserService} from "./user.service.interface";
import {IFrameworkServiceFactory} from "../framework-service-factory.interface";
import {IAuthenticationMethodModel} from "./authentication-method/authentication-method.model.interface";
import {computed, makeObservable, observable, runInAction} from "mobx";
import {IUserAuthenticationStrategy} from "./authentication-strategies/user-authentication.strategy.interface";
import {FirebaseAuthenticationStrategy} from "./authentication-strategies/firebase/firebase-authentication.strategy";
import {FrameworkLocalStorageKeys} from "../storage/local-storage/framework-local-storage-keys";
import {NullableString} from "../../types/nullable-types";

export class UserService extends FrameworkServiceBase implements IUserService {
    constructor(services: IFrameworkServiceFactory) {
        super(services);

        makeObservable<this, '_currentLoginMethodId' | 'currentLoginMethod'>(this, {
            _currentLoginMethodId: observable.ref,
            currentLoginMethod: computed
        })

        this._currentLoginMethodId = this.services.frameworkLocalStorage.getItem(FrameworkLocalStorageKeys.authenticationMethodId);
        this._currentAuthenticationStrategy = new FirebaseAuthenticationStrategy(this.services);

        window.addEventListener("storage", (e) => {
            if (e.key === FrameworkLocalStorageKeys.authenticationMethodId) {
                runInAction(() => {
                    this._currentLoginMethodId = e.newValue;
                })
            }
        });
    }

    private readonly _currentAuthenticationStrategy: IUserAuthenticationStrategy;

    private _currentLoginMethodId: NullableString = null;
    private _setCurrentLoginMethodId(loginMethodId: NullableString): void {
        runInAction(() => {
            this._currentLoginMethodId = loginMethodId;
        });

        if(loginMethodId) {
            this.services.frameworkLocalStorage.setItem(FrameworkLocalStorageKeys.authenticationMethodId, loginMethodId);
        } else {
            this.services.frameworkLocalStorage.removeItem(FrameworkLocalStorageKeys.authenticationMethodId);
        }
    }

    private get currentLoginMethod(): IAuthenticationMethodModel | null {
        return this._currentAuthenticationStrategy.authenticationMethods.find(m => m.id === this._currentLoginMethodId) || null;
    }

    get isAuthenticated(): boolean {
        return Boolean(this.currentLoginMethod?.isAuthenticated);
    }

    async login(): Promise<void> {
        if(this.currentLoginMethod?.isAuthenticated) {
            return;
        }

        const loginMethod = this._currentAuthenticationStrategy.authenticationMethods[0];

        await loginMethod.login();

        if(loginMethod.isAuthenticated) {
            this._setCurrentLoginMethodId(loginMethod.id);
        }

    }

    async logout(): Promise<void> {
        if(!this.currentLoginMethod?.isAuthenticated) {
            return;
        }

        await this.currentLoginMethod.logout();
        this._setCurrentLoginMethodId(null);
    }
}