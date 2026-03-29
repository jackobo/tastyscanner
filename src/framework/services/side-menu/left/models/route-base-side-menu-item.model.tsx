import {SideMenuItemBaseModel} from "./side-menu-item-base.model";
import {IAppServiceFactory} from "../../../../../app/services/app-service-factory.interface";
import {IRoute} from "../../../navigator/models/route.interface";
import React from "react";

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