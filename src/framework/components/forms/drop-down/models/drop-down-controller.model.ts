import {IDropDownController, IDropDownEventListenerSubscription} from "./drop-down-controller.interface";
import {makeObservable, observable, runInAction} from "mobx";
import {IFrameworkServiceFactory} from "../../../../services/framework-service-factory.interface";

export class DropDownControllerModel implements IDropDownController {
    constructor(private readonly services: IFrameworkServiceFactory) {
        makeObservable<this, '_isOpen'>(this, {
            _isOpen: observable.ref
        });
    }

    private _onOpenSubscriptions: Array<() => void> = [];
    private _onCloseSubscriptions: Array<() => void> = [];

    private _isOpen = false;

    get isOpen(): boolean {
        return this._isOpen;
    }

    setIsOpen(value: boolean): void {
        runInAction(() => {
            this._isOpen = value;
        })
    }

    openDropDown(): void {
        if(this.isOpen) {
            return;
        }
        this.setIsOpen(true);

        this._onOpenSubscriptions.forEach(callback => {
            callback();
        })
    }

    closeDropDown(): void {
        if(!this.isOpen) {
            return;
        }
        this.setIsOpen(false);

        this._onCloseSubscriptions.forEach(callback => {
            callback();
        })
    }

    get isInsideModalDialog(): boolean {
        //return this.services.screenMediaQuery.smallScreen;
        return false;
    }

    onClosed(listener: () => void): IDropDownEventListenerSubscription {
        this._onCloseSubscriptions.push(listener);
        return {
            unsubscribe: () => {
                const index = this._onOpenSubscriptions.findIndex(l => l === listener);
                if(index >= 0) {
                    this._onCloseSubscriptions.splice(index, 1);
                }
            }
        }
    }

    onOpen(listener: () => void): IDropDownEventListenerSubscription {
        this._onOpenSubscriptions.push(listener);
        return {
            unsubscribe: () => {
                const index = this._onOpenSubscriptions.findIndex(l => l === listener);
                if(index >= 0) {
                    this._onOpenSubscriptions.splice(index, 1);
                }
            }
        }
    }
}