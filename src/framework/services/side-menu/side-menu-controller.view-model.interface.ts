export interface ISideMenuControllerViewModel {
    readonly menuId: string;
    readonly contentId: string;
    readonly isOpen: boolean;
    toggle(): Promise<void>;
    open(): Promise<void>;
    close(): Promise<void>;
}