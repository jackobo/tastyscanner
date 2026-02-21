
export interface IFiltersSideMenuItemViewModel {
    open(): Promise<void>;
    readonly isOpen: boolean;
}