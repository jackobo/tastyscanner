import React from "react";
import {DialogCloseButtonBehavior, DialogResult} from "./dialog-enums";

export interface IDialogOptions<TAcceptData = any> {
    shouldBeClosedOnlyByUser?: boolean;
    dismissOnEscapeKey?: boolean;
    render: (dialogHandler: IDialogHandler<TAcceptData>) => React.ReactElement;
    onAccept?: (data?: TAcceptData) => Promise<void>;
    onReject?: () => Promise<void>;
    closeButtonBehavior?: DialogCloseButtonBehavior;
}

export interface IStandardDialogOptions<TAcceptData = any> extends IDialogOptions<TAcceptData> {
    /**
     * Has effect only for large screens. For small screens is always 100%
     */
    maxHeight?: string;

    /**
     * Has effect only for large screens. For small screens is always 100%
     */
    width?: string;

    onDidPresent?: (dialogElementRef?: HTMLElement) => Promise<void>;
    forceFullScreenOnLargeScreens?: boolean;
}

export interface ICustomDialogOptions<TAcceptData = any> extends IDialogOptions<TAcceptData> {
}


export interface IPopupDialogOptions<TAcceptData = any> extends IDialogOptions<TAcceptData> {
    maxHeight?: string;
    width?: string;
    /**
     * true if the popup can be closed by clicking on the backdrop overlay
     */
    backdropDismiss?: boolean;
}

export interface ISheetModalDialogOptions<TAcceptData = any> extends IDialogOptions<TAcceptData>{
    backdropDismiss?: boolean;
    breakpoints?: number[];
}

export interface IDialogHandler<TAcceptData = any> {
    accept(data?: TAcceptData): void;
    reject(): void;
    onXCloseButtonClick(): void;
    readonly closeButtonBehavior: DialogCloseButtonBehavior;
    readonly isFullScreenDialog: boolean;
    shouldPreserveBottomSafeArea: boolean;
    readonly hasModalSheetHandle: boolean;
    hasScroll: boolean;
    headerHeight: number;
    contentHeight: number;
    footerHeight: number;
}

export interface IDialogRenderer {
    readonly id: string;
    readonly isOpen: boolean;
    render(): React.ReactElement;
    readonly shouldBeClosedOnlyByUser: boolean;

    /**
     * Rejects the dialog promise instead of calling the onReject callback
     */
    hardReject(): void;
    onXCloseButtonClick(): void;
    onBackdropDismiss(): void;
    onEscapeKeyPressed(): void;
    attachElementRef(element: HTMLElement | undefined): void;
    getAttachedElementRef(): HTMLElement | undefined;
    readonly headerHeight: number;
    readonly contentHeight: number;
    readonly footerHeight: number;
    readonly totalHeight: number
}

export interface IStandardDialogRenderer extends IDialogRenderer {
    onDidPresent(): void;
    readonly forceFullScreenOnLargeScreens: boolean;
}

export interface ICustomDialogRenderer extends IDialogRenderer {
}

export interface IPopupDialogRenderer extends IDialogRenderer {
}

export interface ISheetModalDialogRenderer extends IDialogRenderer {
}

export interface IDialogService {
    readonly hasOpenDialogs: boolean;
    readonly currentOpenDialogs: IDialogRenderer[];

    /**
     * Shows a full screen dialog
     */
    showStandardDialog<TAcceptData = any>(dialogOptions: IStandardDialogOptions<TAcceptData>): Promise<DialogResult>;

    /**
     * Shows a dialog in the center of the screen
     */

    showPopupDialog<TAcceptData = any>(dialogOptions: IPopupDialogOptions<TAcceptData>): Promise<DialogResult>
    /**
     * Shows a dialog at the bottom of the screen
     */
    showSheetModalDialog<TAcceptData = any>(dialogOptions: ISheetModalDialogOptions<TAcceptData>): Promise<DialogResult>

    showCustomDialog<TAcceptData = any>(dialogOptions: ICustomDialogOptions<TAcceptData>): Promise<DialogResult>;

    forceCloseAllDialogs(): void;
}
