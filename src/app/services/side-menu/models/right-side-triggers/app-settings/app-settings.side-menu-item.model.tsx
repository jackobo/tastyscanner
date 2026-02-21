import { SideMenuRenderResult } from "../../../../../../framework/services/side-menu/left/models/side-menu-item.view-model.interface";
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
    renderMenuItemContent(): SideMenuRenderResult {
        return this.services.language.translate('App settings');
    }


    createRightSideMenuRenderer(): AppSettingsRightSideMenuRendererModel {
        return new AppSettingsRightSideMenuRendererModel(this.services, this);
    }

}