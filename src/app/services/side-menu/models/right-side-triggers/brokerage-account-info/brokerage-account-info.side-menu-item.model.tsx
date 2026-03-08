import {RightSideTriggerMenuItemModel} from "../right-side-trigger.menu-item.model";
import React from "react";
import {IonIcon} from "@ionic/react";
import {walletOutline} from "ionicons/icons";
import {
    SideMenuRenderResult
} from "../../../../../../framework/services/side-menu/left/models/side-menu-item.view-model.interface";
import {BrokerageAccountInfoRightSideMenuRendererModel} from "./brokerage-account-info-right-side-menu-renderer.model";



export class BrokerageAccountInfoSideMenuItemModel extends RightSideTriggerMenuItemModel<BrokerageAccountInfoRightSideMenuRendererModel> {

    get key(): string {
        return "AccountInfo";
    }

    /*
    get isVisible(): boolean {
        return Boolean(this.services.brokers.currentAccount?.accountInfo);
    }
     */

    renderIcon(): React.ReactElement | null {
        return (
            <IonIcon icon={walletOutline}/>
        )
    }

    renderMenuItemContent(): SideMenuRenderResult {
        return this.services.language.translate('Account info');
    }

    createRightSideMenuRenderer(): BrokerageAccountInfoRightSideMenuRendererModel {
        return new BrokerageAccountInfoRightSideMenuRendererModel(this.services, this);
    }

}