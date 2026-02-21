import {ISideMenuControllerViewModel} from "./side-menu-controller.view-model.interface";
import {menuController} from "@ionic/core/components";
import {makeObservable, observable, runInAction} from "mobx";

export class SideMenuControllerModel implements ISideMenuControllerViewModel {
    constructor(public readonly menuId: string,
                public readonly contentId: string) {
        makeObservable(this, {
            isOpen: observable.ref
        });
        this._updateIsOpen();
    }

    isOpen: boolean = false;

    async toggle(): Promise<void> {
        await menuController.toggle(this.menuId);
        await this._updateIsOpen();
    }

    async open(): Promise<void> {
        await menuController.open(this.menuId);
        await this._updateIsOpen();
    }

    async close(): Promise<void> {
        await menuController.close(this.menuId);
        await this._updateIsOpen();
    }

    private async _updateIsOpen(): Promise<void> {
        const open = await menuController.isOpen(this.menuId);
        runInAction(() => {
            this.isOpen = open;
        })
    }

}