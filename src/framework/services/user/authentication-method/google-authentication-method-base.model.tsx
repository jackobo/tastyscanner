import React from "react";
import {IAuthenticationMethodModel} from "./authentication-method.model.interface";
import {IFrameworkServiceFactory} from "../../framework-service-factory.interface";


export abstract class GoogleAuthenticationMethodBase implements IAuthenticationMethodModel {
    constructor(protected readonly services: IFrameworkServiceFactory) {
    }

    abstract login(): Promise<boolean>;
    abstract logout(): Promise<void>;

    renderUI(): React.ReactElement {
        return (
            <div>Login with Google</div>
        );
    }
}