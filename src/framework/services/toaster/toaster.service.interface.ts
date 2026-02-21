import React from "react";

export interface IToastHandler {
  close: () => void;
}

export interface ShowToastOptions {
    renderContent: () => (React.ReactElement | string);
    onClose?: (reason?: boolean | string) => void;
}

export interface IToasterService {
    setContainerElementRef(elementRef: HTMLElement): void;
    showToast(options: ShowToastOptions): Promise<IToastHandler>;
    showInfoToast(options: ShowToastOptions): Promise<IToastHandler>;
    showErrorToast(options: ShowToastOptions): Promise<IToastHandler>;
}