import {SideMenuItemBaseModel} from "../../../../../framework/services/side-menu/left/models/side-menu-item-base.model";
import {
    ISideMenuItemViewModel,
    SideMenuRenderResult
} from "../../../../../framework/services/side-menu/left/models/side-menu-item.view-model.interface";
import {IRecentTickersMenuItemViewModel} from "./recent-tickers-menu-item.view-model.interface";
import {IAppServiceFactory} from "../../../app-service-factory.interface";
import {computed, makeObservable, observable, runInAction} from "mobx";
import {
    StandardSideMenuItemComponent
} from "../../../../../framework/components/side-menu/left/standard-side-menu-item.component";
import React from "react";
import {RecentTickersMenuItemComponent} from "../../../../components/side-menu/recent-tickers.menu-item.component";
import {timerOutline} from "ionicons/icons";
import {IonIcon} from "@ionic/react";
import {RecentTickerMenuItem} from "./recent-ticker-menu-item.model";
import {AppLocalStorageKeys} from "../../../storage/app-local-storage-keys";
import {ITickerViewModel} from "../../../../models/ticker.view-model.interface";

export class RecentTickersMenuItemModel extends SideMenuItemBaseModel implements IRecentTickersMenuItemViewModel {
    constructor(services: IAppServiceFactory) {
        super(services);
        this.isExpanded = this.services.localStorage.getItem(AppLocalStorageKeys.recentTickersSideMenuExpanded) === 'true';
        makeObservable<this, '_isExpanded' | '_tickersSubmenus' | '_currentHoveredTicker'>(this, {
            _isExpanded: observable.ref,
            _tickersSubmenus: computed,
            _currentHoveredTicker: observable.ref,
        })
    }
    private _isExpanded: boolean = false;

    get isExpanded(): boolean {
        return this._isExpanded;
    }

    set isExpanded(value: boolean) {
        runInAction(() => {
            this._isExpanded = value;
            this.services.localStorage.setItem(AppLocalStorageKeys.recentTickersSideMenuExpanded, value.toString())
        });
    }

    private _currentHoveredTicker: ITickerViewModel | null = null;
    get currentHoveredTicker(): ITickerViewModel | null {
        return this._currentHoveredTicker;
    }
    set currentHoverTicker(ticker: ITickerViewModel | null) {
        runInAction(() => {
            this._currentHoveredTicker = ticker;
        })

    }

    private get _tickersSubmenus(): ISideMenuItemViewModel[] {
        return this.services.tickers.recentTickers.map(t => new RecentTickerMenuItem(this.services, t, this))
    }

    get subItems(): ISideMenuItemViewModel[] {
        if(!this.isExpanded) {
            return [];
        }

        return this._tickersSubmenus;
    }

    get key(): string {
        return "RecentTickers";
    }

    render(): SideMenuRenderResult {
        return (
            <StandardSideMenuItemComponent renderContent={() => (<RecentTickersMenuItemComponent menuItem={this}/>)}
                                           renderIcon={() => <IonIcon slot="start" icon={timerOutline}/>}
                                           isSelected={() => false}
                                           onClick={async () => {
                                               this.isExpanded = !this.isExpanded;
                                           }}/>
        );
    }

}