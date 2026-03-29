import {
    SideMenuItemBaseModel
} from "../../../../../../framework/services/side-menu/left/models/side-menu-item-base.model";
import { SideMenuRenderResult } from "../../../../../../framework/services/side-menu/left/models/side-menu-item.view-model.interface";
import {
    CurrentBrokerageAccountMenuItemComponent
} from "../../../../../components/side-menu/brokerage-account/current-brokerage-account.menu-item.component";
import React from "react";


export class CurrentBrokerageAccountSideMenuItemModel extends SideMenuItemBaseModel {
    get key(): string {
        return "CurrentBrokerageAccount";
    }

    get shouldCloseMenuOnClick(): boolean {
        return false;
    }

    get isSelected(): boolean {
        return false;
    }

    renderIcon(): React.ReactElement | null {
        return null;
    }

    renderStandardContent(): SideMenuRenderResult {
        return null;
    }

    renderCustomMenu(): SideMenuRenderResult {
        return (
            <CurrentBrokerageAccountMenuItemComponent/>
        )
    }

    async execute(): Promise<void> {

    }

}