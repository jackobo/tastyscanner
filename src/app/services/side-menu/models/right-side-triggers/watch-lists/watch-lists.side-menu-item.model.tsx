import React from "react";
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

    renderLeftSideTitle(): string | React.ReactElement {
        return this.services.language.translate('Watch lists')
    }

    createRightSideMenuRenderer(): WatchListsRightSideMenuRendererModel {
        return new WatchListsRightSideMenuRendererModel(this.services, this);
    }


}