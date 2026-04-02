import React from "react";

export interface IAuthenticationMethodViewModel {
    renderUI(): React.ReactElement;
    login(): Promise<boolean>;
}