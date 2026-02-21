import React from "react";
import {IApiErrorToastHandlerViewModel} from "./api-error-toast-handler.-view-model.interface";
import {IToastHandler} from "../../services/toaster/toaster.service.interface";
import {ApiResponseModel} from "../../models/api-response.model";
import {ApiErrorToastComponent} from "./api-error-toast.component";
import {Check} from "../../utils/type-checking";
import {DialogCloseButtonBehavior} from "../../services/dialog/dialog-enums";
import {ApiErrorDetailsDialogComponent} from "./api-error-details-dialog.component";
import {makeObservable, observable, runInAction} from "mobx";
import {IFrameworkServiceFactory} from "../../services/framework-service-factory.interface";


interface ApiErrorToastHandlerModelOptions<TData> {
    apiResponse: ApiResponseModel<TData>;
    onDismiss: (handler: ApiErrorToastHandlerModel<TData>) => void;
}

export class ApiErrorToastHandlerModel<TData> implements IApiErrorToastHandlerViewModel {
    constructor(private readonly services: IFrameworkServiceFactory,
                private readonly options: ApiErrorToastHandlerModelOptions<TData>) {
        makeObservable(this, {
            isDialogShown: observable.ref
        });
    }

    get endpoint(): string {
        return this.options.apiResponse.endpoint;
    }

    get errorCode(): string {
        return this.options.apiResponse.getErrorCode()?.toString() ?? "";
    }

    get errorDescription(): string {
        return this.options.apiResponse.getErrorDescription() ?? "";
    }

    get errorDetails(): string {

        const details = this.options.apiResponse.getErrorDetails();
        if(!details) {
            return "";
        }

        if(Check.isString(details)) {
            try {
                return JSON.stringify(JSON.parse(details), null, 2);
            } catch {
                return details;
            }

        }

        if(Check.isArray(details) || Check.isObject(details)) {
            try {
                return JSON.stringify(details, null, 2);
            } catch {
                return String(details);
            }
        }

        return details.toString();
    }

    private _toastHandler: IToastHandler | null = null;

    closeToast(): void {
        this._toastHandler?.close();
    }

    isDialogShown: boolean = false;
    async showDetails(): Promise<void> {
        if(this.isDialogShown) {
            return;
        }

        runInAction(() => {
            this.isDialogShown = true;
        })


        try {
            await this.services.dialog.showStandardDialog({
                closeButtonBehavior: DialogCloseButtonBehavior.Accept,
                render: dialogHandler => (<ApiErrorDetailsDialogComponent dialogHandler={dialogHandler} toastHandler={this}/>)
            })
        } finally {
            runInAction(() => {
                this.isDialogShown = false;
            })
        }
    }


    show(): void {
        this.services.toaster.showErrorToast({
            renderContent: () => (<ApiErrorToastComponent handler={this}/>),
            onClose: () => {
                this._toastHandler = null;
                this.options.onDismiss(this);
            }
        }).then(handler => this._toastHandler = handler);
    }

}