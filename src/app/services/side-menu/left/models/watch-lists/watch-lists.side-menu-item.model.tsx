import React from "react";
import { SideMenuRenderResult } from "../../../../../../framework/services/side-menu/left/models/side-menu-item.view-model.interface";
import {
    WatchListsRightSideMenuRendererModel
} from "./watch-lists-right-side-menu-renderer.model";
import {RightSideTriggerMenuItemModel} from "../right-side-trigger.menu-item.model";
import {IonIcon} from "@ionic/react";
import {eyeOutline} from "ionicons/icons";

export class WatchListsSideMenuItem extends RightSideTriggerMenuItemModel<WatchListsRightSideMenuRendererModel> {

    get key(): string {
        return "WatchLists"
    }

    renderIcon(): React.ReactElement | null {
        return (
            <IonIcon icon={eyeOutline}/>
        )
    }

    renderMenuItemContent(): SideMenuRenderResult {
        return this.services.language.translate('Watch lists')
    }

    createRightSideMenuRenderer(): WatchListsRightSideMenuRendererModel {
        return new WatchListsRightSideMenuRendererModel(this.services);
    }


}