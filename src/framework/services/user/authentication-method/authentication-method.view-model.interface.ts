import React from "react";

export interface IAuthenticationMethodViewModel {
    readonly id: string;
    renderUI(): React.ReactElement;
    login(): Promise<void>;
}