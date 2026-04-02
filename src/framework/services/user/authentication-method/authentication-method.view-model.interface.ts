import React from "react";

export interface IAuthenticationMethodViewModel {
    readonly id: string;
    renderUI(options: IRenderUIOptions): React.ReactElement;
    login(): Promise<void>;
}

export interface IRenderUIOptions {
    onAuthenticate: () => Promise<void>;
}