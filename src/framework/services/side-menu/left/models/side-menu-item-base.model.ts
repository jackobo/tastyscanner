import {ISideMenuItemViewModel, SideMenuRenderResult} from "./side-menu-item.view-model.interface";
import {IAppServiceFactory} from "../../../../../app/services/app-service-factory.interface";

export abstract class SideMenuItemBaseModel implements ISideMenuItemViewModel {
    protected constructor(protected readonly services: IAppServiceFactory) {

    }

    abstract get key(): string;
    abstract render(): SideMenuRenderResult;

    get subItems(): ISideMenuItemViewModel[] {
        return [];
    }

}