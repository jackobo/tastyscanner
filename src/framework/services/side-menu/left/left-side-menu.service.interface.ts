import {ISideMenuItemViewModel} from "./models/side-menu-item.view-model.interface";

export interface ILeftSideMenuService {
    readonly rootMenuItems: ISideMenuItemViewModel[];
}
