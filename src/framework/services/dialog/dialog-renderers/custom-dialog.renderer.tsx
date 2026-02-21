import React from "react";
import {DialogBaseRenderer} from "./dialog-base.renderer";
import {ICustomDialogRenderer, ICustomDialogOptions} from "../dialog.service.interface";
import {DialogCloseButtonBehavior} from "../dialog-enums";

export class CustomDialogRenderer<TAcceptData = any> extends DialogBaseRenderer<TAcceptData, ICustomDialogOptions<TAcceptData>> implements ICustomDialogRenderer {
    render(): React.ReactElement {
        return (
            <React.Fragment key={this.id}>
                {this._dialogOptions.render(this)}
            </React.Fragment>
        );
    }

    protected _getDefaultBackButtonBehavior(): DialogCloseButtonBehavior {
        return DialogCloseButtonBehavior.None;
    }

    get isFullScreenDialog(): boolean {
        return true;
    }

    get shouldPreserveBottomSafeArea(): boolean {
        return true;
    }
}
