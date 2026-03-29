import {RouteBaseSideMenuItemModel} from "../../../../../../framework/services/side-menu/left/models/route-base-side-menu-item.model";
import {IAppServiceFactory} from "../../../../app-service-factory.interface";
import {SideMenuRenderResult} from "../../../../../../framework/services/side-menu/left/models/side-menu-item.view-model.interface";
import {IonIcon} from "@ionic/react";
import React from "react";
import {statsChartOutline} from "ionicons/icons";

export class ChartSideMenuItemModel extends RouteBaseSideMenuItemModel {
    constructor(services: IAppServiceFactory) {
        super(services.navigator.routes.chart, services);
    }

    renderIcon(): React.ReactElement {

        return (
            <IonIcon slot="start" icon={statsChartOutline}/>
        )
    }

    renderStandardContent(): SideMenuRenderResult {
        return "Chart";
    }



}