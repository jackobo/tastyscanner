import {
    SideMenuItemBaseModel
} from "../../../../../../framework/services/side-menu/left/models/side-menu-item-base.model";
import React from "react";
import {
    SideMenuRenderResult
} from "../../../../../../framework/services/side-menu/left/models/side-menu-item.view-model.interface";
import {LogoutMenuItemComponent} from "../../../../../components/side-menu/logout.menu-item.component";

export class LogoutSideMenuItemModel extends SideMenuItemBaseModel {
    get key(): string {
        return "logout";
    }

    async execute(): Promise<void> {
        await this.services.user.logout();
    }

    get isSelected(): boolean {
        return false;
    }


    renderIcon(): React.ReactElement | null {
        return null;
    }

    renderStandardContent(): SideMenuRenderResult {
        return (
            <LogoutMenuItemComponent/>
        )
    }

}