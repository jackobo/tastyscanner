import {RightSideTriggerMenuItemModel} from "../right-side-trigger.menu-item.model";
import {IonIcon} from "@ionic/react";
import {settingsOutline} from "ionicons/icons";
import React from "react";
import {AppSettingsRightSideMenuRendererModel} from "./app-settings-right-side-menu-renderer.model";

export class AppSettingsSideMenuItemModel extends RightSideTriggerMenuItemModel<AppSettingsRightSideMenuRendererModel> {

    get key(): string {
        return "AppSettings";
    }


    renderIcon(): React.ReactElement | null {
        return (
            <IonIcon icon={settingsOutline}/>
        )
    }
    renderLeftSideTitle(): string | React.ReactElement {
        return this.services.language.translate('App settings');
    }


    createRightSideMenuRenderer(): AppSettingsRightSideMenuRendererModel {
        return new AppSettingsRightSideMenuRendererModel(this.services, this);
    }

}