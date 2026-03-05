import {TriggerRightSideMenuRendererBase} from "../trigger-right-side-menu-renderer-base.model";
import React from "react";
import {
    BrokerageAccountInfoComponent
} from "../../../../../components/brokerage-account-info/brokerage-account-info.component";


export class BrokerageAccountInfoRightSideMenuRendererModel extends TriggerRightSideMenuRendererBase{

    get isSticky(): boolean {
        return true;
    }

    renderContent(): React.ReactElement {
        return (<BrokerageAccountInfoComponent/>)
    }

}