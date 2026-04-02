import {IAuthenticationMethodViewModel} from "./authentication-method.view-model.interface";

export interface IAuthenticationMethodModel extends IAuthenticationMethodViewModel {
    readonly isAuthenticated: boolean;
    logout(): Promise<void>;
}