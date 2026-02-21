import {
    ISideMenuContentRenderer
} from "../../../../../framework/services/side-menu/side-menu-content-renderer.interface";
import {IAppServiceFactory} from "../../../app-service-factory.interface";
import {IRightSideTriggerMenuItemViewModel} from "./right-side-trigger.menu-item.view-model.interface";
import React from "react";
import {
    StandardRightSideMenuHeaderComponent
} from "../../../../components/side-menu/standard-right-side-menu-header.box";

export abstract class TriggerRightSideMenuRendererBase implements ISideMenuContentRenderer {
    constructor(protected readonly services: IAppServiceFactory, protected readonly rightSideMenuItemTrigger: IRightSideTriggerMenuItemViewModel) {

    }

    abstract renderContent(): React.ReactElement;
    get isSticky(): boolean {
        return true;
    }

    renderHeader(): string | React.ReactElement {
        return (
            <StandardRightSideMenuHeaderComponent renderIcon={() => this.rightSideMenuItemTrigger.renderIcon()}>
                {this.rightSideMenuItemTrigger.renderMenuItemContent()}
            </StandardRightSideMenuHeaderComponent>
        )

    }
}
