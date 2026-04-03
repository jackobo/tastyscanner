import {IFrameworkServiceFactory} from "../../framework-service-factory.interface";
import {ILeftSideMenuService} from "./left-side-menu.service.interface";
import {ISideMenuItemViewModel} from "./models/side-menu-item.view-model.interface";
import {ISideMenuItemsGroupViewModel} from "./models/side-menu-items-group.view-model.interface";
import {ServiceBase} from "../../service-base";
import {Lazy} from "../../../utils/lazy";
import {RightSideMenuControllerModel} from "../right/right-side-menu-controller.model";
import {MAIN_CONTENT} from "../../../global-constants";
import {LEFT_SIDE_MENU} from "../../../components/side-menu/side-menu-consts";

export abstract class LeftSideMenuBaseService<TServiceFactory extends IFrameworkServiceFactory> extends ServiceBase<TServiceFactory>
                                                              implements ILeftSideMenuService {
    abstract get isVisible(): boolean;
    abstract get rootMenuItems(): ISideMenuItemViewModel[];
    abstract get menuItemsGroups(): ISideMenuItemsGroupViewModel[];


    private _leftSideMenuController: Lazy<RightSideMenuControllerModel> = new Lazy<RightSideMenuControllerModel>(() => {
        return new RightSideMenuControllerModel(LEFT_SIDE_MENU, MAIN_CONTENT);
    });

    open(): Promise<void> {
        return this._leftSideMenuController.value.open();
    }
    close(): Promise<void> {
        return this._leftSideMenuController.value.close();
    }
}