import {SideMenuControllerModel} from "../side-menu-controller.model";
import {ISideMenuContentRenderer} from "../side-menu-content-renderer.interface";
import {makeObservable, observable, runInAction} from "mobx";

export class RightSideMenuControllerModel extends SideMenuControllerModel {
    constructor(menuId: string,
                contentId: string) {
        super(menuId, contentId);

        makeObservable(this, {
            currentRenderer: observable.ref
        })
    }

    currentRenderer: ISideMenuContentRenderer | null = null;

    private _setCurrentRenderer(renderer: ISideMenuContentRenderer | null): void {
        runInAction(() => {
            this.currentRenderer = renderer;
        })
    }

    async show(renderer: ISideMenuContentRenderer): Promise<void> {
        this._setCurrentRenderer(renderer);
        await super.open()
    }

    async hide(): Promise<void> {
        this._setCurrentRenderer(null);
        await super.close();
    }
}