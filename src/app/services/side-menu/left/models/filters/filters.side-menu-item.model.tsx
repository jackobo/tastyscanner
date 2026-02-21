import {SideMenuItemBaseModel} from "../../../../../../framework/services/side-menu/left/models/side-menu-item-base.model";
import { SideMenuRenderResult } from "../../../../../../framework/services/side-menu/left/models/side-menu-item.view-model.interface";
import {IFiltersSideMenuItemViewModel} from "./filters.side-menu-item.view-model.interface";
import {FiltersRightSideMenuRendererModel} from "../../../right/models/filters/filters-right-side-menu-renderer.model";
import {Lazy} from "../../../../../../framework/utils/lazy";
import {
    FiltersSideMenuItemComponent
} from "../../../../../components/side-menu/filters/filters.side-menu-item.component";

export class FiltersSideMenuItemModel extends SideMenuItemBaseModel implements IFiltersSideMenuItemViewModel {
    get key(): string {
        return "Filters";
    }


    render(): SideMenuRenderResult {
        return (
            <FiltersSideMenuItemComponent menuItem={this}/>
        )
    }

    private _rightSideMenuRenderer: Lazy<FiltersRightSideMenuRendererModel> = new Lazy<FiltersRightSideMenuRendererModel>(() => {
        return new FiltersRightSideMenuRendererModel(this.services);
    });

    get rightSideMenuRenderer(): FiltersRightSideMenuRendererModel {
        return this._rightSideMenuRenderer.value;
    }

    get isOpen(): boolean {
        return this.services.rightSideMenu.currentRenderer === this.rightSideMenuRenderer;
    }

    async open(): Promise<void>{
        await this.rightSideMenuRenderer.open();
    }

}