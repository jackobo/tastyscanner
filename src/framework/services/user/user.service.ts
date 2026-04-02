import {FrameworkServiceBase} from "../framework-service-base";
import {IUserService} from "./user.service.interface";
import {IFrameworkServiceFactory} from "../framework-service-factory.interface";
import {IAuthenticationMethodModel} from "./authentication-method/authentication-method.model.interface";
import {Check} from "../../utils/type-checking";
import {makeObservable, observable, runInAction} from "mobx";
import {IUserAuthenticationStrategy} from "./authentication-strategies/user-authentication.strategy.interface";
import {FirebaseAuthenticationStrategy} from "./authentication-strategies/firebase/firebase-authentication.strategy";

export class UserService extends FrameworkServiceBase implements IUserService {
    constructor(services: IFrameworkServiceFactory) {
        super(services);

        makeObservable<this, '_currentLoginMethod'>(this, {
            _currentLoginMethod: observable.ref
        })

        this._currentAuthenticationStrategy = new FirebaseAuthenticationStrategy(this.services);

    }

    private readonly _currentAuthenticationStrategy: IUserAuthenticationStrategy;

    private _currentLoginMethod: IAuthenticationMethodModel | null = null;

    get isAuthenticated(): boolean {
        return !Check.isNullOrUndefined(this._currentLoginMethod);
    }

    async login(): Promise<void> {
        if(this._currentLoginMethod) {
            return;
        }

        const loginMethod = this._currentAuthenticationStrategy.authenticationMethods[0];

        if(await loginMethod.login()) {
            runInAction(() => {
                this._currentLoginMethod = loginMethod;
            })
        }

    }

    async logout(): Promise<void> {
        if(!this._currentLoginMethod) {
            return;
        }

        await this._currentLoginMethod.logout();
        runInAction(() => {
            this._currentLoginMethod = null;
        })
    }
}