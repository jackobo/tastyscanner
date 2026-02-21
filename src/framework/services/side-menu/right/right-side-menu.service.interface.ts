import {ISideMenuContentRenderer} from "../side-menu-content-renderer.interface";

export interface IRightSideMenuService {
    readonly contentId: string;
    readonly stickySideMenuId: string;
    readonly nonStickySideMenuId: string;
    readonly currentStickyRenderer: ISideMenuContentRenderer | null;
    readonly currentNonStickyRenderer: ISideMenuContentRenderer | null;
    open(renderer: ISideMenuContentRenderer): Promise<void>;
    close(renderer: ISideMenuContentRenderer): Promise<void>;
    isOpen(renderer: ISideMenuContentRenderer): boolean;
}