import {RouteBaseSideMenuItemModel} from "../../../../../../../framework/services/side-menu/left/models/route-base-side-menu-item.model";
import {IAppServiceFactory} from "../../../../../app-service-factory.interface";
import {SideMenuRenderResult} from "../../../../../../../framework/services/side-menu/left/models/side-menu-item.view-model.interface";
import {IonIcon} from "@ionic/react";
import React from "react";
import {layersOutline} from "ionicons/icons";

export class StrategiesSideMenuItemModel extends RouteBaseSideMenuItemModel {
    constructor(services: IAppServiceFactory) {
        super(services.navigator.routes.home, services);
    }

    renderIcon(): React.ReactElement {

        return (
            <IonIcon slot="start" icon={layersOutline}/>
        )
    }

    renderContent(): SideMenuRenderResult {
        return "Strategies";
    }



}