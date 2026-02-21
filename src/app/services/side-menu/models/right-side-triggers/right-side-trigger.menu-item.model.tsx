import React from "react";
import {IRightSideTriggerMenuItemViewModel} from "./right-side-trigger.menu-item.view-model.interface";
import {
    ISideMenuContentRenderer
} from "../../../../../framework/services/side-menu/side-menu-content-renderer.interface";
import {Lazy} from "../../../../../framework/utils/lazy";
import {IAppServiceFactory} from "../../../app-service-factory.interface";
import {SideMenuItemBaseModel} from "../../../../../framework/services/side-menu/left/models/side-menu-item-base.model";
import { SideMenuRenderResult } from "../../../../../framework/services/side-menu/left/models/side-menu-item.view-model.interface";
import {
    RightSideTriggerMenuItemComponent
} from "../../../../components/side-menu/right-side-trigger.menu-item.component";

export abstract class RightSideTriggerMenuItemModel<TRightSideMenuRenderer extends ISideMenuContentRenderer> extends SideMenuItemBaseModel implements IRightSideTriggerMenuItemViewModel {

    constructor(protected readonly services: IAppServiceFactory) {
        super(services);
    }

    abstract get key(): string;
    abstract createRightSideMenuRenderer(): TRightSideMenuRenderer;
    abstract renderIcon(): React.ReactElement | null;
    abstract renderMenuItemContent(): SideMenuRenderResult;

    render(): SideMenuRenderResult {
        return (
            <RightSideTriggerMenuItemComponent menuItem={this}/>
        )
    }

    private _rightSideMenuRenderer: Lazy<TRightSideMenuRenderer> = new Lazy<TRightSideMenuRenderer>(() => {
        return this.createRightSideMenuRenderer();
    });

    get rightSideMenuRenderer(): TRightSideMenuRenderer {
        return this._rightSideMenuRenderer.value;
    }

    get isOpen(): boolean {
        return this.services.rightSideMenu.currentRenderer === this.rightSideMenuRenderer;
    }

    async onClick(): Promise<void>{
        if(this.isOpen) {
            await this.services.rightSideMenu.close();
        } else {
            await this.services.rightSideMenu.open(this.rightSideMenuRenderer);
        }

    }

}