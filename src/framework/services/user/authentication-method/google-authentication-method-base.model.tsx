import React from "react";
import {IAuthenticationMethodModel} from "./authentication-method.model.interface";
import {IFrameworkServiceFactory} from "../../framework-service-factory.interface";
import {AuthenticateWithGoogleButton} from "../../../components/login-form/authenticate-with-google-button.component";
import {IRenderUIOptions} from "./authentication-method.view-model.interface";


export abstract class GoogleAuthenticationMethodBase implements IAuthenticationMethodModel {
    constructor(protected readonly services: IFrameworkServiceFactory) {
    }

    abstract get id(): string;
    abstract get isAuthenticated(): boolean;
    abstract login(): Promise<void>;
    abstract logout(): Promise<void>;

    renderUI(options: IRenderUIOptions): React.ReactElement {
        return (
            <AuthenticateWithGoogleButton onClick={options.onAuthenticate}/>
        );
    }
}