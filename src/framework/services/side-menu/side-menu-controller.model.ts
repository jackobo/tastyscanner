import {ISideMenuControllerViewModel} from "./side-menu-controller.view-model.interface";
import {menuController} from "@ionic/core/components";
import {makeObservable, observable, runInAction} from "mobx";

export class SideMenuControllerModel implements ISideMenuControllerViewModel {
    constructor(public readonly menuId: string,
                public readonly contentId: string) {
        makeObservable(this, {
            isOpen: observable.ref
        });

        menuController.isOpen(this.menuId).then(isOpen => {
            this._setIsOpen(isOpen);
        });
    }

    isOpen: boolean = false;

    private _setIsOpen(value: boolean): void {
        runInAction(() => {
            this.isOpen = value;
        })
    }

    async toggle(): Promise<void> {
        await menuController.toggle(this.menuId);

        this._setIsOpen(!this.isOpen);
    }

    async open(): Promise<void> {
        await menuController.open(this.menuId);
        this._setIsOpen(true);
    }

    async close(): Promise<void> {
        await menuController.close(this.menuId);
        this._setIsOpen(false);
    }

}