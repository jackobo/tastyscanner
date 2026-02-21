import React from "react";
import {
    SideMenuRenderResult
} from "../../../../../framework/services/side-menu/left/models/side-menu-item.view-model.interface";


export interface IRightSideTriggerMenuItemViewModel {
    readonly isOpen: boolean;
    open(): Promise<void>;
    renderIcon(): React.ReactElement | null;
    renderMenuItemContent(): SideMenuRenderResult;
}