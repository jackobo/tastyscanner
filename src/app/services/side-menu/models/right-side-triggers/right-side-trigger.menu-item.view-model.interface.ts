import React from "react";

export interface IRightSideTriggerMenuItemViewModel {
    renderIcon(): React.ReactElement | null;
    renderTitle(): string | React.ReactElement;
    readonly isOpen: boolean;
}