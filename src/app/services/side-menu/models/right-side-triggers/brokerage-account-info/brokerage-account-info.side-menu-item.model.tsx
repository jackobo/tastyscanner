import {RightSideTriggerMenuItemModel} from "../right-side-trigger.menu-item.model";
import React from "react";
import {IonIcon} from "@ionic/react";
import {walletOutline} from "ionicons/icons";
import {BrokerageAccountInfoRightSideMenuRendererModel} from "./brokerage-account-info-right-side-menu-renderer.model";



export class BrokerageAccountInfoSideMenuItemModel extends RightSideTriggerMenuItemModel<BrokerageAccountInfoRightSideMenuRendererModel> {

    get key(): string {
        return "AccountInfo";
    }

    renderIcon(): React.ReactElement | null {
        return (
            <IonIcon icon={walletOutline}/>
        )
    }

    renderTitle(): string | React.ReactElement {
        return this.services.language.translate('Account info');
    }

    createRightSideMenuRenderer(): BrokerageAccountInfoRightSideMenuRendererModel {
        return new BrokerageAccountInfoRightSideMenuRendererModel(this.services, this);
    }

}