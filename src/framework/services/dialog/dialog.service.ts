import {
    ICustomDialogOptions,
    IDialogOptions,
    IDialogRenderer,
    IDialogService,
    IPopupDialogOptions,
    ISheetModalDialogOptions,
    IStandardDialogOptions
} from "./dialog.service.interface";
import {action, makeObservable, observable, reaction, runInAction} from "mobx";
import {StandardDialogRenderer} from "./dialog-renderers/standard-dialog.renderer";
import {CustomDialogRenderer} from "./dialog-renderers/custom-dialog.renderer";
import {DialogResult} from "./dialog-enums";
import {PopupDialogRenderer} from "./dialog-renderers/popup-dialog.renderer";
import {SheetModalDialogRenderer} from "./dialog-renderers/sheet-modal-dialog.renderer";
import {IRoutingGuard, RoutingGuardContext, RoutingGuardResult} from "../navigator/navigator.service.interface";
import {IFrameworkServiceFactory} from "../framework-service-factory.interface";
import {FrameworkServiceBase} from "../framework-service-base";


export class DialogService extends FrameworkServiceBase implements IDialogService, IRoutingGuard {
    constructor(services: IFrameworkServiceFactory) {
        super(services);
        makeObservable(this, {
            _currentOpenDialogs: observable.ref,
            _openDialog: action.bound,
            _closeDialog: action.bound
        });

        this.services.navigator.registerRoutingGuard(this);


        reaction(() => this.services.navigator.currentRoute,
            () => {
                this.forceCloseAllDialogs();
            });


    }

    get hasOpenDialogs(): boolean {
        return this.currentOpenDialogs.length > 0;
    }

    forceCloseAllDialogs(): void {
        runInAction(() => {
            const remainingDialogs: IDialogRenderer[] = [];
            for(let i = this.currentOpenDialogs.length - 1; i >= 0; i--) {
                if(this.currentOpenDialogs[i].shouldBeClosedOnlyByUser) {
                    remainingDialogs.push(this.currentOpenDialogs[i]);
                } else {
                    this.currentOpenDialogs[i]?.hardReject();
                }

            }
            this._currentOpenDialogs = remainingDialogs.reverse();
        })

    }


    async canNavigate(context: RoutingGuardContext): Promise<RoutingGuardResult> {
        if(!this.hasOpenDialogs) {
            return RoutingGuardResult.Allow;
        }

        if(context.targetLocationIsHomePage) {
            return RoutingGuardResult.Allow;
        }

        if(context.isForwardNavigation) {
            return RoutingGuardResult.Block;
        }

        const dialog = this.currentOpenDialogs[this.currentOpenDialogs.length - 1];
        dialog.onXCloseButtonClick();

        return RoutingGuardResult.Block;
    }



    _currentOpenDialogs: IDialogRenderer[] = [];
    get currentOpenDialogs(): IDialogRenderer[] {
        return this._currentOpenDialogs;
    }

    _openDialog(dialog: IDialogRenderer): void {
        runInAction(() => {
            this._currentOpenDialogs = [...this._currentOpenDialogs, dialog];
        });
    }

    _closeDialog(dialogId: string): void {
        const dialogIndex = this._currentOpenDialogs.findIndex(d => d.id === dialogId);
        if(dialogIndex >= 0) {
            this._currentOpenDialogs.splice(dialogIndex, 1);
            runInAction(() => {
                this._currentOpenDialogs = [...this._currentOpenDialogs];
            });
        }


        if(dialogId) {
            // If the dialog root element is still in the DOM we will forcibly remove it.
            // This might happen when the dialog is shown and then accepted/rejected very fast.
            // In this case ionic is not capable to rerender so quick and an empty dialog will remain on screen.
            setTimeout(() => {
                try {
                    const element = this.services.document.getElementById(dialogId);
                    if(element) {
                        element.remove();
                    }
                } catch (err) {
                    this.services.logger.error('Failed to remove dialog by id', err);
                }

            }, 100);
        }

    }

    private _acceptDialog<T>(options: IDialogOptions<T>,
                            resolve: (value: (DialogResult | PromiseLike<DialogResult>)) => void,
                            reject: (reason?: any) => void,
                            data?: T) {
        if(options.onAccept) {
            options.onAccept(data).then(() => {
                resolve(DialogResult.Accepted);
            }).catch(err => {
                reject(err);
            });
        } else {
            resolve(DialogResult.Accepted);
        }
    }

    private _rejectDialog<T>(dialogOptions: IDialogOptions<T>,
                             resolve: (value: (DialogResult | PromiseLike<DialogResult>)) => void,
                             reject: (reason?: any) => void) {

        if(dialogOptions.onReject) {
            dialogOptions.onReject().then(() => {
                resolve(DialogResult.Rejected);
            }).catch(err => {
                reject(err);
            });
        } else {
            resolve(DialogResult.Rejected);
        }
    }

    private _closeAndAcceptDialog<T>(dialogId: string,
                                     options: IDialogOptions<T>,
                                    resolve: (value: (DialogResult | PromiseLike<DialogResult>)) => void,
                                    reject: (reason?: any) => void,
                                    data?: T) {
        this._closeDialog(dialogId);
        this._acceptDialog(options, resolve, reject, data);
    }

    private _closeAndRejectDialog<T>(dialogId: string,
                                     dialogOptions: IDialogOptions<T>,
                                     resolve: (value: (DialogResult | PromiseLike<DialogResult>)) => void,
                                     reject: (reason?: any) => void) {

        this._closeDialog(dialogId);
        this._rejectDialog(dialogOptions, resolve, reject);
    }


    showStandardDialog<TTAcceptData = any>(dialogOptions: IStandardDialogOptions<TTAcceptData>): Promise<DialogResult> {
        return new Promise((resolve, reject) => {
            const dialogRenderer = new StandardDialogRenderer<TTAcceptData>(dialogOptions,
                (data) => {
                    this._closeAndAcceptDialog(dialogRenderer.id, dialogOptions, resolve, reject, data);

                }, () => {
                    this._closeAndRejectDialog(dialogRenderer.id, dialogOptions, resolve, reject);
                }, () => {
                    resolve(DialogResult.Rejected);
                });

            this._openDialog(dialogRenderer);
        });
    }

    showPopupDialog<TAcceptDataT = any>(dialogOptions: IPopupDialogOptions<TAcceptDataT>): Promise<DialogResult> {
        return new Promise((resolve, reject) => {
            const dialogRenderer = new PopupDialogRenderer<TAcceptDataT>(dialogOptions,
                (data) => {
                    this._closeAndAcceptDialog(dialogRenderer.id, dialogOptions, resolve, reject, data);

                }, () => {
                    this._closeAndRejectDialog(dialogRenderer.id, dialogOptions, resolve, reject);
                }, () => {
                    resolve(DialogResult.Rejected);
                });

            this._openDialog(dialogRenderer);
        });
    }

    showSheetModalDialog<TAcceptData = any>(dialogOptions: ISheetModalDialogOptions<TAcceptData>): Promise<DialogResult> {
        return new Promise((resolve, reject) => {
            const dialogRenderer = new SheetModalDialogRenderer<TAcceptData>(dialogOptions,
                (data) => {
                    this._closeAndAcceptDialog(dialogRenderer.id, dialogOptions, resolve, reject, data);

                }, () => {
                    this._closeAndRejectDialog(dialogRenderer.id, dialogOptions, resolve, reject);
                }, () => {
                    resolve(DialogResult.Rejected);
                });

            this._openDialog(dialogRenderer);
        });
    }

    showCustomDialog<TAcceptData = any>(dialogOptions: ICustomDialogOptions<TAcceptData>): Promise<DialogResult> {
        return new Promise((resolve, reject) => {
            const dialogRenderer = new CustomDialogRenderer<TAcceptData>(dialogOptions,
                (data) => {
                    this._closeAndAcceptDialog(dialogRenderer.id, dialogOptions, resolve, reject, data);

                }, () => {
                    this._closeAndRejectDialog(dialogRenderer.id, dialogOptions, resolve, reject);
                }, () => {
                    resolve(DialogResult.Rejected);
                });

            this._openDialog(dialogRenderer);
        });
    }
}


