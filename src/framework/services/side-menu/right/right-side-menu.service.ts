import {IRightSideMenuService} from "./right-side-menu.service.interface";
import {Lazy} from "../../../utils/lazy";
import {ISideMenuContentRenderer} from "../side-menu-content-renderer.interface";
import { runInAction} from "mobx";
import {FrameworkServiceBase} from "../../framework-service-base";
import {MAIN_CONTENT} from "../../../global-constants";
import {RightSideMenuControllerModel} from "./right-side-menu-controller.model";
import {delay} from "../../../utils/delay-function";


export class RightSideMenuService extends FrameworkServiceBase implements IRightSideMenuService {


    get contentId(): string {
        return MAIN_CONTENT;
    }

    get stickySideMenuId(): string {
        return this.stickyController.menuId;
    }

    get nonStickySideMenuId(): string {
        return this.nonStickyController.menuId;
    }

    private _stickyController: Lazy<RightSideMenuControllerModel> = new Lazy<RightSideMenuControllerModel>(() => {
        return new RightSideMenuControllerModel('right-side-menu-sticky', MAIN_CONTENT);
    });

    private get stickyController(): RightSideMenuControllerModel {
        return this._stickyController.value;
    }

    private _nonStickyController: Lazy<RightSideMenuControllerModel> = new Lazy<RightSideMenuControllerModel>(() => {
        return new RightSideMenuControllerModel('right-side-menu-non-sticky', MAIN_CONTENT);
    });

    private get nonStickyController(): RightSideMenuControllerModel {
        return this._nonStickyController.value;
    }

    get currentStickyRenderer(): ISideMenuContentRenderer | null {
        return this.stickyController.currentRenderer
    }

    get currentNonStickyRenderer(): ISideMenuContentRenderer | null {
        return this.nonStickyController.currentRenderer;
    }

    async open(renderer: ISideMenuContentRenderer): Promise<void> {
        //TODO - I have to do something with this delay
        //await delay(Date.now(), 500);
        runInAction(() => {

            if(renderer.isSticky && !this.services.screenMediaQuery.smallScreen) {
                this.stickyController.show(renderer);
            } else {
                this.nonStickyController.show(renderer);
            }
        });

    }
    async close(renderer: ISideMenuContentRenderer): Promise<void> {
        if(renderer === this.stickyController.currentRenderer) {
            await this.stickyController.hide();
        } else if(renderer === this.nonStickyController.currentRenderer) {
            await this.nonStickyController.hide();
        }
    }

    isOpen(renderer: ISideMenuContentRenderer): boolean {
        if(renderer.isSticky) {
            return this.stickyController.currentRenderer === renderer;
        } else {
            return this.nonStickyController.currentRenderer === renderer;
        }
    }



}