import React from "react";
import {TimeSpan} from "../../types/time-span";

export interface IToastHandler {
  close: () => void;
}

export interface ShowToastOptions {
    renderContent: () => (React.ReactElement | string);
    onClose?: (reason?: boolean | string) => void;
    autoCloseTime?: TimeSpan;
}

export interface IToasterService {
    setContainerElementRef(elementRef: HTMLElement): void;
    showToast(options: ShowToastOptions): Promise<IToastHandler>;
    showInfoToast(options: ShowToastOptions): Promise<IToastHandler>;
    showErrorToast(options: ShowToastOptions): Promise<IToastHandler>;
}