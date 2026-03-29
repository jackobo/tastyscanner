import {SideMenuItemBaseModel} from "./side-menu-item-base.model";
import {IAppServiceFactory} from "../../../../../app/services/app-service-factory.interface";
import {IRoute} from "../../../navigator/models/route.interface";
import {SideMenuRenderResult} from "./side-menu-item.view-model.interface";
import React from "react";
import {StandardSideMenuItemComponent} from "../../../../components/side-menu/left/standard-side-menu-item.component";

export abstract class RouteBaseSideMenuItemModel extends SideMenuItemBaseModel {
    protected constructor(protected readonly route: IRoute, services: IAppServiceFactory) {
        super(services);
    }

    get key(): string {
        return this.route.path;
    }

    async execute(): Promise<void> {
        this.route.activate();
    }

    get isSelected(): boolean {
        return this.route.isActive;
    }

    renderIcon(): React.ReactElement | null {
        return null;
    }


}