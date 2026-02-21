import React from "react";
import {DialogBaseRenderer} from "./dialog-base.renderer";
import {StandardDialogComponent} from "../../../components/modal/standard-dialog.component";
import {IStandardDialogRenderer, IStandardDialogOptions} from "../dialog.service.interface";
import {DialogCloseButtonBehavior} from "../dialog-enums";

export class StandardDialogRenderer<T = any> extends DialogBaseRenderer<T, IStandardDialogOptions<T>> implements IStandardDialogRenderer {
    render(): React.ReactElement {
        return (
            <StandardDialogComponent key={this.id} renderer={this}
                                     width={this._dialogOptions.width}
                                     maxHeight={this._dialogOptions.maxHeight}>
                {this._dialogOptions.render(this)}
            </StandardDialogComponent>
        );
    }

    get forceFullScreenOnLargeScreens(): boolean {
        return Boolean(this._dialogOptions.forceFullScreenOnLargeScreens);
    }


    onDidPresent(): void {
        if(this._dialogOptions.onDidPresent) {
            this._dialogOptions.onDidPresent(this.getAttachedElementRef())
        }

    }

    protected _getDefaultBackButtonBehavior(): DialogCloseButtonBehavior {
        return DialogCloseButtonBehavior.Reject;
    }


    get isFullScreenDialog(): boolean {
        return true;
    }

    get shouldPreserveBottomSafeArea(): boolean {
        return true;
    }
}
