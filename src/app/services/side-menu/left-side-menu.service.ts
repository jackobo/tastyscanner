import {ILeftSideMenuService} from "../../../framework/services/side-menu/left/left-side-menu.service.interface";
import {ISideMenuItemViewModel} from "../../../framework/services/side-menu/left/models/side-menu-item.view-model.interface";
import {AppServiceBase} from "../app-service-base";
import {StrategiesSideMenuItemModel} from "./models/navigation/strategies/strategies.side-menu-item.model";
import {FiltersSideMenuItemModel} from "./models/right-side-triggers/filters/filters.side-menu-item.model";
import {WatchListsSideMenuItem} from "./models/right-side-triggers/watch-lists/watch-lists.side-menu-item.model";
import {OpenPositionsSideMenuItemModel} from "./models/navigation/open-positions/open-positions.side-menu-item.model";
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

export class LeftSideMenuService extends AppServiceBase implements ILeftSideMenuService {
    
    get rootMenuItems(): ISideMenuItemViewModel[] {
        return [
            new CurrentBrokerageAccountSideMenuItemModel(this.services),
            new StrategiesSideMenuItemModel(this.services),
            new OpenPositionsSideMenuItemModel(this.services),
            new ChartSideMenuItemModel(this.services),

        ];
    }

    get menuItemsGroups(): ISideMenuItemsGroupViewModel[] {
        return [
            {
                key: "utils-side-menu-group",
                menuItems: [
                    new BrokerageAccountInfoSideMenuItemModel(this.services),
                    new FiltersSideMenuItemModel(this.services),
                    new WatchListsSideMenuItem(this.services),
                    new AppSettingsSideMenuItemModel(this.services)
                ]
            },
            {
                key: "recent-tickers-menu-group",
                menuItems: [
                    new RecentTickersMenuItemModel(this.services)
                ]
            }
        ];
    }


}