import {IAuthenticationMethodModel} from "../authentication-method/authentication-method.model.interface";


export interface IUserAuthenticationStrategy {
    readonly authenticationMethods: IAuthenticationMethodModel[];
}
