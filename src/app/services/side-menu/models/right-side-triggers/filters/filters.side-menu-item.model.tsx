import {FiltersRightSideMenuRendererModel} from "./filters-right-side-menu-renderer.model";
import {RightSideTriggerMenuItemModel} from "../right-side-trigger.menu-item.model";
import {IonIcon} from "@ionic/react";
import {funnelOutline} from "ionicons/icons";
import React from "react";

export class FiltersSideMenuItemModel extends RightSideTriggerMenuItemModel<FiltersRightSideMenuRendererModel> {

    get key(): string {
        return "Filters";
    }


    renderIcon(): React.ReactElement | null {
        return (
            <IonIcon icon={funnelOutline}/>
        )
    }
    renderTitle(): string | React.ReactElement {
        return this.services.language.translate('Filters');
    }


    createRightSideMenuRenderer(): FiltersRightSideMenuRendererModel {
        return new FiltersRightSideMenuRendererModel(this.services, this);
    }

}