import React from "react";
import {IAlertService} from "./alert.service.interface";
import {DialogCloseButtonBehavior} from "../dialog/dialog-enums";
import {ErrorMessageDialogComponent} from "../../components/error-message/error-message-dialog.component";
import {FrameworkServiceBase} from "../framework-service-base";

export class AlertService extends FrameworkServiceBase implements IAlertService {

    showError(message: string): void {
       this.showErrorAsync(message);
    }

    async showErrorAsync(message: string): Promise<void> {
        await this.services.dialog.showPopupDialog({
            closeButtonBehavior: DialogCloseButtonBehavior.Accept,
            backdropDismiss: true,
            width: '416px',
            maxHeight: '480px',
            render: dialogHandler => (<ErrorMessageDialogComponent dialogHandler={dialogHandler} message={message}/>)
        })
    }
}
