import React from "react";
import {AppSettingsComponent} from "../../../../../components/app-settings/app-settings.component";
import {TriggerRightSideMenuRendererBase} from "../trigger-right-side-menu-renderer-base.model";

export class AppSettingsRightSideMenuRendererModel extends TriggerRightSideMenuRendererBase{

    get isSticky(): boolean {
        return false;
    }

    renderContent(): React.ReactElement {
        return (<AppSettingsComponent/>)
    }

}