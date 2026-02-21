import {ILeftSideMenuService} from "../../../../framework/services/side-menu/left/left-side-menu.service.interface";
import {ISideMenuItemViewModel} from "../../../../framework/services/side-menu/left/models/side-menu-item.view-model.interface";
import {AppServiceBase} from "../../app-service-base";
import {HomeSideMenuItemModel} from "./models/navigation/home/home.side-menu-item.model";
import {FiltersSideMenuItemModel} from "./models/right-side-triggers/filters/filters.side-menu-item.model";
import {WatchListsSideMenuItem} from "./models/right-side-triggers/watch-lists/watch-lists.side-menu-item.model";
import {OpenPositionsSideMenuItemModel} from "./models/navigation/open-positions/open-positions.side-menu-item.model";

export class LeftSideMenuService extends AppServiceBase implements ILeftSideMenuService {
    
    get rootMenuItems(): ISideMenuItemViewModel[] {
        return [
            new HomeSideMenuItemModel(this.services),
            new OpenPositionsSideMenuItemModel(this.services),
            new FiltersSideMenuItemModel(this.services),
            new WatchListsSideMenuItem(this.services)
        ];
    }


}