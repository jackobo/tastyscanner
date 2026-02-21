import {IRightSideMenuService} from "./right-side-menu.service.interface";
import {Lazy} from "../../../utils/lazy";
import {ISideMenuControllerViewModel} from "../side-menu-controller.view-model.interface";
import {SideMenuControllerModel} from "../side-menu-controller.model";

import {ISideMenuContentRenderer} from "../side-menu-content-renderer.interface";
import {makeObservable, observable, runInAction} from "mobx";
import {IFrameworkServiceFactory} from "../../framework-service-factory.interface";
import {FrameworkServiceBase} from "../../framework-service-base";
import {MAIN_CONTENT} from "../../../global-constants";


export class RightSideMenuService extends FrameworkServiceBase implements IRightSideMenuService {

    constructor(services: IFrameworkServiceFactory) {
        super(services);
        makeObservable(this, {
            currentRenderer: observable.ref
        })
    }

    get sideMenuId(): string {
        return this.rightSideMenuController.menuId;
    }
    get contentId(): string {
        return this.rightSideMenuController.contentId;
    }

    private _rightSideMenuController: Lazy<ISideMenuControllerViewModel> = new Lazy<ISideMenuControllerViewModel>(() => {
        return new SideMenuControllerModel('right-side-menu', MAIN_CONTENT);
    });

    private get rightSideMenuController(): ISideMenuControllerViewModel {
        return this._rightSideMenuController.value;
    }

    currentRenderer: ISideMenuContentRenderer | null = null;

    async open(renderer: ISideMenuContentRenderer): Promise<void> {
        runInAction(() => {
            this.currentRenderer = renderer;
        });

        await this.rightSideMenuController.open()
    }
    async close(): Promise<void> {
        await this.rightSideMenuController.close();
        runInAction(() => {
            this.currentRenderer = null;
        })
    }


}