import {IAuthenticationMethodViewModel} from "./authentication-method.view-model.interface";

export interface IAuthenticationMethodModel extends IAuthenticationMethodViewModel {
    logout(): Promise<void>;
}