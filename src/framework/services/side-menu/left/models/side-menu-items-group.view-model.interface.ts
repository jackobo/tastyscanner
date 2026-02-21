import {ISideMenuItemViewModel} from "./side-menu-item.view-model.interface";

export interface ISideMenuItemsGroupViewModel {
    readonly key: string;
    readonly menuItems: ISideMenuItemViewModel[];
}