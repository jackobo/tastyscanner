import {IWatchListsSideMenuItemViewModel} from "./watch-lists.side-menu-item.view-model";
import {
    SideMenuItemBaseModel
} from "../../../../../../framework/services/side-menu/left/models/side-menu-item-base.model";
import { SideMenuRenderResult } from "../../../../../../framework/services/side-menu/left/models/side-menu-item.view-model.interface";
import {
    WatchListsSideMenuItemComponent
} from "../../../../../components/side-menu/watch-lists/watch-lists.side-menu-item.component";
import {Lazy} from "../../../../../../framework/utils/lazy";
import {
    WatchListsRightSideMenuRendererModel
} from "../../../right/models/watch-lists/watch-lists-right-side-menu-renderer.model";

export class WatchListsSideMenuItem extends SideMenuItemBaseModel implements IWatchListsSideMenuItemViewModel {
    get key(): string {
        return "WatchLists"
    }
    render(): SideMenuRenderResult {
        return (
            <WatchListsSideMenuItemComponent menuItem={this}/>
        )
    }

    private _rightSideMenuRenderer: Lazy<WatchListsRightSideMenuRendererModel> = new Lazy<WatchListsRightSideMenuRendererModel>(() => {
        return new WatchListsRightSideMenuRendererModel(this.services);
    });

    get rightSideMenuRenderer(): WatchListsRightSideMenuRendererModel {
        return this._rightSideMenuRenderer.value;
    }

    get isOpen(): boolean {
        return this.services.rightSideMenu.currentRenderer === this.rightSideMenuRenderer;
    }

    async open(): Promise<void>{
        await this.rightSideMenuRenderer.open();
    }
}