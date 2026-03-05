import React from "react";


export type SideMenuRenderResult = string | React.ReactElement;

export interface ISideMenuItemViewModel {
    readonly key: string;
    readonly isVisible: boolean;
    render(): SideMenuRenderResult;
    readonly subItems: ISideMenuItemViewModel[];
}