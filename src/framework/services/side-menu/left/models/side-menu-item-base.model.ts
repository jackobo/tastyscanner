import {ISideMenuItemViewModel, SideMenuRenderResult} from "./side-menu-item.view-model.interface";
import {IAppServiceFactory} from "../../../../../app/services/app-service-factory.interface";
import React from "react";

export abstract class SideMenuItemBaseModel implements ISideMenuItemViewModel {
    constructor(protected readonly services: IAppServiceFactory) {

    }

    abstract get key(): string;
    abstract get isSelected(): boolean;
    abstract renderIcon(): React.ReactElement | null;
    abstract renderStandardContent(): SideMenuRenderResult;
    abstract execute(): Promise<void>;

    get isVisible(): boolean {
        return true;
    }

    get shouldCloseMenuOnClick(): boolean {
        return true;
    }

    get subItems(): ISideMenuItemViewModel[] {
        return [];
    }

    renderCustomMenu(): SideMenuRenderResult {
        return null;
    }

}