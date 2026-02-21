import {DialogBaseRenderer} from "./dialog-base.renderer";
import {IPopupDialogOptions, IPopupDialogRenderer} from "../dialog.service.interface";
import React from "react";
import {PopUpDialogComponent} from "../../../components/modal/pop-up-dialog.component";
import {DialogCloseButtonBehavior} from "../dialog-enums";

export class PopupDialogRenderer<T = any> extends DialogBaseRenderer<T, IPopupDialogOptions<T>> implements IPopupDialogRenderer {
    render(): React.ReactElement {
        return (
            <PopUpDialogComponent key={this.id}
                                  renderer={this}
                                  maxHeight={this._dialogOptions.maxHeight}
                                  width={this._dialogOptions.width}
                                  backdropDismiss={this._dialogOptions.backdropDismiss}>
                {this._dialogOptions.render(this)}
            </PopUpDialogComponent>
        );
    }

    protected _getDefaultBackButtonBehavior(): DialogCloseButtonBehavior {
        return DialogCloseButtonBehavior.None;
    }

    get isFullScreenDialog(): boolean {
        return false;
    }

    get shouldPreserveBottomSafeArea(): boolean {
        return false;
    }

}
