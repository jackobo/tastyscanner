import {
    RouteBaseSideMenuItemModel
} from "../../../../../../framework/services/side-menu/left/models/route-base-side-menu-item.model";
import {IAppServiceFactory} from "../../../../app-service-factory.interface";
import React from "react";
import {IonIcon} from "@ionic/react";
import {hourglassOutline} from "ionicons/icons";
import {
    SideMenuRenderResult
} from "../../../../../../framework/services/side-menu/left/models/side-menu-item.view-model.interface";

export class WorkingOrdersSideMenuItemModel extends RouteBaseSideMenuItemModel {
    constructor(services: IAppServiceFactory) {
        super(services.navigator.routes.workingOrders, services);
    }

    renderIcon(): React.ReactElement {

        return (
            <IonIcon slot="start" icon={hourglassOutline}/>
        )
    }

    renderContent(): SideMenuRenderResult {
        return "Working Orders";
    }
}