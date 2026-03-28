import {RouteBaseSideMenuItemModel} from "../../../../../../framework/services/side-menu/left/models/route-base-side-menu-item.model";
import {IAppServiceFactory} from "../../../../app-service-factory.interface";
import {
    ISideMenuItemViewModel,
    SideMenuRenderResult
} from "../../../../../../framework/services/side-menu/left/models/side-menu-item.view-model.interface";
import {IonIcon} from "@ionic/react";
import React from "react";

import {IronCondorsSideMenuItemModel} from "./iron-condors.side-menu-item.model";
import {PutCreditSpreadsSideMenuItemModel} from "./put-credit-spreads.side-menu-item.model";
import {CallCreditSpreadsSideMenuItemModel} from "./call-credit-spreads.side-menu-item.model";
import {layersOutline} from "ionicons/icons";

export class StrategiesSideMenuItemModel extends RouteBaseSideMenuItemModel {
    constructor(services: IAppServiceFactory) {
        super(services.navigator.routes.strategies.ironCondors, services);
    }

    renderIcon(): React.ReactElement {

        return (
            <IonIcon slot="start" icon={layersOutline}/>
        )
    }

    renderContent(): SideMenuRenderResult {
        return "Strategies";
    }

    get subItems(): ISideMenuItemViewModel[] {
        return [
            new IronCondorsSideMenuItemModel(this.services),
            new PutCreditSpreadsSideMenuItemModel(this.services),
            new CallCreditSpreadsSideMenuItemModel(this.services),
        ]
    }
}