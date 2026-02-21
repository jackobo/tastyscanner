import {DialogBaseRenderer} from "./dialog-base.renderer";
import {
    ISheetModalDialogOptions,
    ISheetModalDialogRenderer,
} from "../dialog.service.interface";
import React from "react";
import {DialogCloseButtonBehavior} from "../dialog-enums";
import {SheetModalDialogComponent} from "../../../components/modal/sheet-modal-dialog.component";

export class SheetModalDialogRenderer<T = any> extends DialogBaseRenderer<T, ISheetModalDialogOptions<T>> implements ISheetModalDialogRenderer {

    private get _backdropDismiss(): boolean {
        return this._dialogOptions.backdropDismiss ?? true;
    }

    render(): React.ReactElement {
        const breakpoints = this._dialogOptions.breakpoints ?? [0.5, 0.75, 1];
        const backdropDismiss = this._dialogOptions.backdropDismiss ?? true;

        if(this._backdropDismiss && breakpoints[0] !== 0) {
            // insert the breakpoint at zero so the user can dismiss the modal also by swipe down gesture
            breakpoints.splice(0, 0, 0);
        }

        return (
            <SheetModalDialogComponent key={this.id}
                                       renderer={this}
                                       breakpoints={breakpoints}
                                       backdropDismiss={backdropDismiss}
                                       showHandle={this.hasModalSheetHandle}>
                {this._dialogOptions.render(this)}
            </SheetModalDialogComponent>
        );
    }

    protected _getDefaultBackButtonBehavior(): DialogCloseButtonBehavior {
        return DialogCloseButtonBehavior.None;
    }

    get isFullScreenDialog(): boolean {
        return false;
    }

    get shouldPreserveBottomSafeArea(): boolean {
        return true;
    }

    get hasModalSheetHandle(): boolean {
        return this._backdropDismiss;
    }

}
