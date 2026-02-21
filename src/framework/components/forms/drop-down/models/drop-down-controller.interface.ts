export interface IDropDownEventListenerSubscription {
    unsubscribe(): void;
}
export interface IDropDownController {
    readonly isInsideModalDialog: boolean;
    readonly isOpen: boolean;
    openDropDown():void;
    closeDropDown(): void;
    onOpen(listener: () => void): IDropDownEventListenerSubscription;
    onClosed(listener: () => void): IDropDownEventListenerSubscription;
}
