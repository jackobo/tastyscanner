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

    abstract renderContent(): SideMenuRenderResult;

    get key(): string {
        return this.route.path;
    }

    async click(): Promise<void> {
        this.route.activate();
    }

    protected _isSelected(): boolean {
        return this.route.isActive;
    }

    get isSelected(): boolean {
        return this._isSelected();
    }

    renderIcon(): React.ReactElement | null {
        return null;
    }


    render(): SideMenuRenderResult {
        return (
            <StandardSideMenuItemComponent renderContent={() => this.renderContent()}
                                           renderIcon={() => this.renderIcon()}
                                           isSelected={() => this.isSelected}
                                           onClick={() => this.click()}/>
        );
    }

}