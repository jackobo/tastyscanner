import React from "react";
import {
    ISideMenuContentRenderer
} from "../../../../../../../framework/services/side-menu/side-menu-content-renderer.interface";
import {IAppServiceFactory} from "../../../../../app-service-factory.interface";
import {StrategyFiltersComponent} from "../../../../../../components/side-menu/filters/strategy-filters.component";
import {StandardRightSideMenuHeaderBox} from "../../../../../../components/side-menu/standard-right-side-menu-header.box";
import {WatchListsComponent} from "../../../../../../components/side-menu/watch-lists/watch-lists.component";

export class WatchListsRightSideMenuRendererModel implements ISideMenuContentRenderer {
    constructor(private readonly services: IAppServiceFactory) {

    }
    readonly isSticky: boolean = true;

    renderHeader(): string | React.ReactElement {
        return (
            <StandardRightSideMenuHeaderBox>
                {this.services.language.translate("Watch lists")}
            </StandardRightSideMenuHeaderBox>
        )

    }

    renderContent(): React.ReactElement {
        return (<WatchListsComponent/>)
    }

}