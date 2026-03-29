import {ISideMenuItemViewModel} from "./models/side-menu-item.view-model.interface";
import {ISideMenuItemsGroupViewModel} from "./models/side-menu-items-group.view-model.interface";

export interface ILeftSideMenuService {
    readonly rootMenuItems: ISideMenuItemViewModel[];
    readonly menuItemsGroups: ISideMenuItemsGroupViewModel[];
    open(): Promise<void>;
    close(): Promise<void>;
}
