import React from "react";
import {InputLabelRendererType} from "../../../input-label-renderer.type";
import {IDialogHandler} from "../../../../../services/dialog/dialog.service.interface";


export interface IDropDownDialogOptions {
    renderTitle?: InputLabelRendererType;
    renderHeaderContent?: (dlg: IDialogHandler) => (React.ReactElement | null);
    renderFooterContent?: (dlg: IDialogHandler) => (React.ReactElement | null);
    breakpoints?: number[];

}
