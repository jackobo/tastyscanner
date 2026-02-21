import {
    SideMenuItemBaseModel
} from "../../../../../../framework/services/side-menu/left/models/side-menu-item-base.model";
import { SideMenuRenderResult } from "../../../../../../framework/services/side-menu/left/models/side-menu-item.view-model.interface";
import {
    CurrentBrokerageAccountMenuItemComponent
} from "../../../../../components/side-menu/brokerage-account/current-brokerage-account.menu-item.component";

export class CurrentBrokerageAccountSideMenuItemModel extends SideMenuItemBaseModel {
    get key(): string {
        return "CurrentBrokerageAccount";
    }
    render(): SideMenuRenderResult {
        return (
            <CurrentBrokerageAccountMenuItemComponent/>
        )
    }
    
}