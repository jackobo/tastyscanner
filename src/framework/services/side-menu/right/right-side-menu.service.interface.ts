import {ISideMenuContentRenderer} from "../side-menu-content-renderer.interface";

export interface IRightSideMenuService {
    readonly sideMenuId: string;
    readonly contentId: string;
    readonly currentRenderer: ISideMenuContentRenderer | null;
    open(renderer: ISideMenuContentRenderer): Promise<void>;
    close(): Promise<void>;
}