import React from "react";

export interface ISideMenuContentRenderer {
    readonly isSticky: boolean;
    renderHeader(): string | React.ReactElement;
    renderContent(): React.ReactElement;
}