import {ILeftSideMenuService} from "../../../framework/services/side-menu/left/left-side-menu.service.interface";
import {ISideMenuItemViewModel} from "../../../framework/services/side-menu/left/models/side-menu-item.view-model.interface";
import {StrategiesSideMenuItemModel} from "./models/navigation/strategies/strategies.side-menu-item.model";
import {FiltersSideMenuItemModel} from "./models/right-side-triggers/filters/filters.side-menu-item.model";
import {WatchListsSideMenuItem} from "./models/right-side-triggers/watch-lists/watch-lists.side-menu-item.model";
import {ActivePositionsSideMenuItemModel} from "./models/navigation/active-positions/active-positions.side-menu-item.model";
import {ChartSideMenuItemModel} from "./models/navigation/chart/chart.side-menu-item.model";
import {
    ISideMenuItemsGroupViewModel
} from "../../../framework/services/side-menu/left/models/side-menu-items-group.view-model.interface";
import {
    AppSettingsSideMenuItemModel
} from "./models/right-side-triggers/app-settings/app-settings.side-menu-item.model";
import {
    CurrentBrokerageAccountSideMenuItemModel
} from "./models/settings/brokerage-account/current-brokerage-account.side-menu-item.model";
import {RecentTickersMenuItemModel} from "./models/recent-tickers/recent-tickers-menu-item.model";
import {
    BrokerageAccountInfoSideMenuItemModel
} from "./models/right-side-triggers/brokerage-account-info/brokerage-account-info.side-menu-item.model";
import {WorkingOrdersSideMenuItemModel} from "./models/navigation/working-orders/working-orders.side-menu-item.model";
import {LeftSideMenuBaseService} from "../../../framework/services/side-menu/left/left-side-menu-base.service";
import {IAppServiceFactory} from "../app-service-factory.interface";

export class LeftSideMenuService extends LeftSideMenuBaseService<IAppServiceFactory> implements ILeftSideMenuService {
    
    get rootMenuItems(): ISideMenuItemViewModel[] {
        return [
            new CurrentBrokerageAccountSideMenuItemModel(this.services),
            new StrategiesSideMenuItemModel(this.services),
            new ActivePositionsSideMenuItemModel(this.services),
            new WorkingOrdersSideMenuItemModel(this.services),
            new ChartSideMenuItemModel(this.services),

        ];
    }

    get menuItemsGroups(): ISideMenuItemsGroupViewModel[] {
        return [
            {
                key: "recent-tickers-menu-group",
                menuItems: [
                    new RecentTickersMenuItemModel(this.services)
                ]
            },
            {
                key: "utils-side-menu-group",
                menuItems: [
                    new FiltersSideMenuItemModel(this.services),
                    new WatchListsSideMenuItem(this.services),
                    new BrokerageAccountInfoSideMenuItemModel(this.services),
                    new AppSettingsSideMenuItemModel(this.services)
                ]
            }

        ];
    }


}