import {SideMenuItemBaseModel} from "../../../../../framework/services/side-menu/left/models/side-menu-item-base.model";
import {IAppServiceFactory} from "../../../app-service-factory.interface";
import {ITickerViewModel} from "../../../../models/ticker.view-model.interface";
import { SideMenuRenderResult } from "../../../../../framework/services/side-menu/left/models/side-menu-item.view-model.interface";
import {
    StandardSideMenuItemComponent
} from "../../../../../framework/components/side-menu/left/standard-side-menu-item.component";
import {IonIcon} from "@ionic/react";
import {radioButtonOffOutline, radioButtonOnOutline} from "ionicons/icons";
import React from "react";
import {IRecentTickerMenuItemViewModel} from "./recent-ticker-menu-item.view-model.interface";
import {RecentTickerMenuItemComponent} from "../../../../components/side-menu/recent-ticker.menu-item.component";

export class RecentTickerMenuItem extends SideMenuItemBaseModel implements IRecentTickerMenuItemViewModel {

    constructor(services: IAppServiceFactory, public readonly ticker: ITickerViewModel) {
        super(services);
    }

    get key(): string {
        return `RecentTicker_${this.ticker.symbol}`
    }

    get isCurrentTicker(): boolean {
        return this.ticker.symbol === this.services.tickers.currentTicker?.symbol;
    }
    render(): SideMenuRenderResult {
        return (
            <StandardSideMenuItemComponent renderContent={() => (<RecentTickerMenuItemComponent menuItem={this}/>)}
                                           isSelected={() => this.isCurrentTicker}
                                           renderIcon={() => <IonIcon slot="start" icon={this.isCurrentTicker ? radioButtonOnOutline : radioButtonOffOutline}/> }
                                           level={() => 1}
                                           onClick={async () => {
                                               await this.services.tickers.setCurrentTicker(this.ticker.symbol);
                                           }}/>
        );
    }


}