import React from "react";
import {IDialogHandler, IDialogOptions, IDialogRenderer} from "../dialog.service.interface";
import {v4 as uuidv4} from "uuid";
import {DialogCloseButtonBehavior} from "../dialog-enums";

import {makeObservable, observable, runInAction} from "mobx";
import {Check} from "../../../utils/type-checking";

export abstract class DialogBaseRenderer<TAcceptData = any, TOptions extends IDialogOptions<TAcceptData> = IDialogOptions<TAcceptData>> implements IDialogRenderer, IDialogHandler<TAcceptData> {
    constructor(protected readonly _dialogOptions: TOptions,
                private readonly _onUserAccept: (data?: TAcceptData) => void,
                private readonly _onUserReject: () => void,
                private readonly _onHardReject: () => void) {

        this.id = uuidv4();
        makeObservable<this, '_hasScroll' | '_contentHeight' | '_headerHeight' | '_footerHeight'>(this, {
            isOpen: observable.ref,
            _hasScroll: observable.ref,
            _headerHeight: observable.ref,
            _contentHeight: observable.ref,
            _footerHeight: observable.ref
        });
    }


    readonly id: string;

    abstract render(): React.ReactElement;
    abstract get isFullScreenDialog(): boolean;
    abstract get shouldPreserveBottomSafeArea(): boolean;
    get hasModalSheetHandle(): boolean {
        return false;
    }



    isOpen: boolean = true;
    private _setIsOpen(value: boolean): void {
        runInAction(() => {
            this.isOpen = value;
        })
    }

    private _hasScroll: boolean = false;
    get hasScroll(): boolean {
        return this._hasScroll;
    }

    set hasScroll(value: boolean) {
        runInAction(() => this._hasScroll = value);
    }

    private _headerHeight: number = 0;
    get headerHeight(): number {
        return this._headerHeight;
    }

    set headerHeight(value: number) {
        runInAction(() => this._headerHeight = value);
    }

    private _contentHeight: number = 0;
    get contentHeight(): number {
        return this._contentHeight;
    }

    set contentHeight(value: number) {
        runInAction(() => this._contentHeight = value);
    }

    private _footerHeight: number = 0;
    get footerHeight(): number {
        return this._footerHeight;
    }

    set footerHeight(value: number) {
        runInAction(() => this._footerHeight = value);
    }

    get totalHeight(): number {
        return this.headerHeight + this.contentHeight + this.footerHeight;
    }


    accept(data?: TAcceptData) {
        this._onUserAccept(data);
        this._setIsOpen(false);
    }

    reject() {
        this._onUserReject();
        this._setIsOpen(false);
    }

    hardReject() {
        this._onHardReject();
        this._setIsOpen(false);
    }


    protected abstract _getDefaultBackButtonBehavior(): DialogCloseButtonBehavior;

    get closeButtonBehavior(): DialogCloseButtonBehavior {
        if(Check.isUndefined(this._dialogOptions.closeButtonBehavior)) {
            return this._getDefaultBackButtonBehavior();
        }

        return this._dialogOptions.closeButtonBehavior;
    }

    onXCloseButtonClick(): void {

        switch (this.closeButtonBehavior) {
            case DialogCloseButtonBehavior.Accept:
                this.accept();
                break;
            case DialogCloseButtonBehavior.Reject:
                this.reject();
                break;
        }
    }

    onEscapeKeyPressed() {
        if(this._dialogOptions.dismissOnEscapeKey) {
            if(this.closeButtonBehavior === DialogCloseButtonBehavior.Accept) {
                this.accept();
            }  else {
                this.reject();
            }
        }
    }

    onBackdropDismiss(): void {
        if(this.closeButtonBehavior === DialogCloseButtonBehavior.Accept) {
            this.accept();
        }  else {
            this.reject();
        }

    }

    private _elementRef: HTMLElement | undefined = undefined;

    attachElementRef(element: HTMLElement | undefined): void {
        this._elementRef = element;
    }

    getAttachedElementRef(): HTMLElement | undefined {
        return this._elementRef;
    }

    get shouldBeClosedOnlyByUser(): boolean {
        return Boolean(this._dialogOptions.shouldBeClosedOnlyByUser);
    }
}
