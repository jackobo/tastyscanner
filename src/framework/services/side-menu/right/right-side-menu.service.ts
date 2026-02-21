import {IRightSideMenuService} from "./right-side-menu.service.interface";
import {Lazy} from "../../../utils/lazy";
import {ISideMenuContentRenderer} from "../side-menu-content-renderer.interface";
import { runInAction} from "mobx";
import {FrameworkServiceBase} from "../../framework-service-base";
import {MAIN_CONTENT} from "../../../global-constants";
import {RightSideMenuControllerModel} from "./right-side-menu-controller.model";


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
        runInAction(() => {
            if(renderer.isSticky) {
                this.stickyController.openRenderer(renderer);
            } else {
                this.nonStickyController.openRenderer(renderer);
            }
        });

        await this.stickyController.open()
    }
    async close(renderer: ISideMenuContentRenderer): Promise<void> {
        if(this.stickyController.isOpen && renderer === this.stickyController.currentRenderer) {
            await this.stickyController.close();
        } else if(this.nonStickyController.isOpen && renderer === this.nonStickyController.currentRenderer) {
            await this.nonStickyController.close();
        }
    }

    isOpen(renderer: ISideMenuContentRenderer): boolean {
        if(renderer.isSticky) {
            return this.stickyController.isOpen && this.stickyController.currentRenderer === renderer;
        } else {
            return this.nonStickyController.isOpen && this.nonStickyController.currentRenderer === renderer;
        }
    }



}