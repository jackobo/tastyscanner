import React from "react";

export interface IRightSideTriggerMenuItemViewModel {
    renderIcon(): React.ReactElement | null;
    renderLeftSideTitle(): string | React.ReactElement;
    renderRightSideTitle(): string | React.ReactElement;
    readonly isOpen: boolean;
}