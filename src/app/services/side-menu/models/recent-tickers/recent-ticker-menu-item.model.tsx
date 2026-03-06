import {SideMenuItemBaseModel} from "../../../../../framework/services/side-menu/left/models/side-menu-item-base.model";
import {IAppServiceFactory} from "../../../app-service-factory.interface";
import {ITickerViewModel} from "../../../../models/ticker.view-model.interface";
import { SideMenuRenderResult } from "../../../../../framework/services/side-menu/left/models/side-menu-item.view-model.interface";
import {
    StandardSideMenuItemComponent
} from "../../../../../framework/components/side-menu/left/standard-side-menu-item.component";
import React from "react";
import {IRecentTickerMenuItemViewModel} from "./recent-ticker-menu-item.view-model.interface";
import {RecentTickerMenuItemComponent} from "../../../../components/side-menu/recent-ticker.menu-item.component";
import {RecentTickersMenuItemModel} from "./recent-tickers-menu-item.model";

export class RecentTickerMenuItem extends SideMenuItemBaseModel implements IRecentTickerMenuItemViewModel {

    constructor(services: IAppServiceFactory,
                public readonly ticker: ITickerViewModel,
                private readonly parent: RecentTickersMenuItemModel) {
        super(services);
    }

    get key(): string {
        return `RecentTicker_${this.ticker.symbol}`
    }

    get isCurrentTicker(): boolean {
        return this.ticker.symbol === this.services.tickers.currentTicker?.symbol;
    }

    get isHovered(): boolean {
        return this.parent.currentHoveredTicker?.symbol === this.ticker.symbol;
    }

    set isHovered(value: boolean) {
        if(value) {
            this.parent.currentHoverTicker = this.ticker;
        } else {
            this.parent.currentHoverTicker = null;
        }
    }



    render(): SideMenuRenderResult {
        return (
            <StandardSideMenuItemComponent renderContent={() => (<RecentTickerMenuItemComponent menuItem={this}/>)}
                                           isSelected={() => false}
                                           level={() => 1}/>
        );
    }


}