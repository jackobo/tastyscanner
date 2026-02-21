export interface IWatchListsSideMenuItemViewModel {
    open(): Promise<void>;
    readonly isOpen: boolean;
}