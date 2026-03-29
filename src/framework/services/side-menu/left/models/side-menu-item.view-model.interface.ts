import React from "react";


export type SideMenuRenderResult = string | React.ReactElement | null;

export interface ISideMenuItemViewModel {
    readonly key: string;
    readonly isVisible: boolean;
    readonly isSelected: boolean;
    readonly subItems: ISideMenuItemViewModel[];
    readonly shouldCloseMenuOnClick: boolean;
    renderCustomMenu(): SideMenuRenderResult;
    renderIcon(): React.ReactElement | null;
    renderStandardContent(): SideMenuRenderResult;
    execute(): Promise<void>;

}