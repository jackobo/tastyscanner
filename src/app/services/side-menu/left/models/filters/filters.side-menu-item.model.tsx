import { SideMenuRenderResult } from "../../../../../../framework/services/side-menu/left/models/side-menu-item.view-model.interface";
import {FiltersRightSideMenuRendererModel} from "./filters-right-side-menu-renderer.model";
import {RightSideTriggerMenuItemModel} from "../right-side-trigger.menu-item.model";
import {IonIcon} from "@ionic/react";
import {filterOutline} from "ionicons/icons";
import React from "react";

export class FiltersSideMenuItemModel extends RightSideTriggerMenuItemModel<FiltersRightSideMenuRendererModel> {

    get key(): string {
        return "Filters";
    }


    renderIcon(): React.ReactElement | null {
        return (
            <IonIcon icon={filterOutline}/>
        )
    }
    renderMenuItemContent(): SideMenuRenderResult {
        return this.services.language.translate('Filters');
    }


    createRightSideMenuRenderer(): FiltersRightSideMenuRendererModel {
        return new FiltersRightSideMenuRendererModel(this.services);
    }

}