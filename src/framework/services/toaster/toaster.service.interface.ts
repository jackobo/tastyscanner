import React from "react";

export interface IToastHandler {
  close: () => void;
}

export interface ShowToastOptions {
    renderContent: () => (React.ReactElement | string);
    onClose?: (reason?: boolean | string) => void;
}

export interface IToasterService {
    showToast(options: ShowToastOptions): IToastHandler;
    showInfoToast(options: ShowToastOptions): IToastHandler;
    showErrorToast(options: ShowToastOptions): IToastHandler;
}