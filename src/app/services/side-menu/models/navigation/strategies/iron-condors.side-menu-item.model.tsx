import {
    RouteBaseSideMenuItemModel
} from "../../../../../../framework/services/side-menu/left/models/route-base-side-menu-item.model";
import {IAppServiceFactory} from "../../../../app-service-factory.interface";
import React from "react";
import {IonIcon} from "@ionic/react";
import {layersOutline} from "ionicons/icons";
import {
    SideMenuRenderResult
} from "../../../../../../framework/services/side-menu/left/models/side-menu-item.view-model.interface";

export class IronCondorsSideMenuItemModel extends RouteBaseSideMenuItemModel {
    constructor(services: IAppServiceFactory) {
        super(services.navigator.routes.strategies.ironCondors, services);
    }

    renderIcon(): React.ReactElement {

        return (
            <IonIcon slot="start" icon={layersOutline}/>
        );
    }

    renderContent(): SideMenuRenderResult {
        return "Iron Condors";
    }

    protected _getLevel(): number {
        return 1;
    }
}