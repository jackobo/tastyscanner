import React from 'react';
import {IStandardDropDownItemViewModel} from "../item/standard-drop-down-list-item-view-model.interface";
import {computed, makeObservable, observable, runInAction} from "mobx";
import {IStandardDropDownListViewModel} from "./standard-drop-down-list-view-model.interface";
import {
    IDropDownController,
    IDropDownEventListenerSubscription
} from "../../../../drop-down/models/drop-down-controller.interface";
import {IFormField} from "../../../../../../models/forms/form-field.interface";
import {Check} from "../../../../../../utils/type-checking";
import {IFrameworkServiceFactory} from "../../../../../../services/framework-service-factory.interface";


export interface IDropDownListModelOptions<TFieldValue> {
    field: IFormField<TFieldValue>;
    services: IFrameworkServiceFactory;
    initialItems: IStandardDropDownItemViewModel<TFieldValue>[];
    inputElementRef: React.RefObject<HTMLElement | null>;
    inputContainerElementRef: React.RefObject<HTMLElement | null>;
}

export class StandardDropDownListModel<TFieldValue> implements IStandardDropDownListViewModel<TFieldValue> {
    constructor(private readonly options: IDropDownListModelOptions<TFieldValue>) {
        this._allItems = options.initialItems;
        this._field = options.field;
        makeObservable<this, '_searchText'
                             | '_currentFocusedItemIndex'
                             | '_allItems'
                             | '_dropDownController'
                             | '_field'>(this, {
            _searchText: observable.ref,
            _currentFocusedItemIndex: observable.ref,
            _allItems: observable.ref,
            _dropDownController: observable.ref,
            filteredItems: computed,
            _field: observable.ref
        });
    }

    private _searchText: string = "";
    private _currentFocusedItemIndex: number = 0;
    private _allItems: IStandardDropDownItemViewModel<TFieldValue>[] = [];
    private _field: IFormField<TFieldValue>

    private _dropDownController: IDropDownController | null = null;
    private _dropdownControllerEventSubscriptions: IDropDownEventListenerSubscription[] = [];


    updateItems(items: IStandardDropDownItemViewModel<TFieldValue>[]): void {
        runInAction(() => {
            this._allItems = items;
        });
    }

    get filteredItems(): IStandardDropDownItemViewModel<TFieldValue>[] {
        const filter = this._searchText.toLowerCase().trim();

        if(filter) {
            return this._allItems.filter(item => item.applyFilter(filter));
        } else {
            return this._allItems;
        }
    }


    get unfilteredItemsCount(): number {
        return this._allItems.length;
    }

    setDropDownController(controller: IDropDownController): void {

        this._dropdownControllerEventSubscriptions.forEach(s => s.unsubscribe());
        this._dropdownControllerEventSubscriptions = [];

        runInAction(() => {
            this._dropDownController = controller;
            this._dropdownControllerEventSubscriptions.push(this._dropDownController.onOpen(this._onDropDownOpen));
            this._dropdownControllerEventSubscriptions.push(this._dropDownController.onClosed(this._onDropDownClose));
        });
    }

    get isDropDownOpen(): boolean {
        return Boolean(this._dropDownController?.isOpen);
    }

    get isInsideModalDialog(): boolean {
        return Boolean(this._dropDownController?.isInsideModalDialog);
    }

    get currentFocusedItemIndex(): number {
        if(this._currentFocusedItemIndex >= this.filteredItems.length) {
            runInAction(() => {
                this._currentFocusedItemIndex = 0;
            });
        }
        return this._currentFocusedItemIndex;
    }

    set currentFocusedItemIndex(value: number) {
        runInAction(() => {
            this._currentFocusedItemIndex = Math.min(Math.max(0, value), this.filteredItems.length - 1);
        });
    }

    get selectedItem(): IStandardDropDownItemViewModel<TFieldValue> | null {
        if(!Check.isNullOrUndefined(this._field.value)) {
            return this._allItems.find(i => i.isSameAs(this._field.value)) ?? null;
        }
        return null;
    }


    setSelectedItem(item: IStandardDropDownItemViewModel<TFieldValue>): void {
        this._field.setValue(item.geDropDownValue());
        this._dropDownController?.closeDropDown();
    }

    clearSelectedItem(): void {
        this._field.setValue(null);
        this._dropDownController?.closeDropDown();
    }

    updateField(field:  IFormField<TFieldValue>) {
        runInAction(() => {
            this._field = field;
        });
    }

    get searchText(): string {
        if(this.isDropDownOpen) {
            return this._searchText;
        } else {
            return this.selectedItem?.getDropDownDisplayText() ?? "";
        }

    }

    set searchText(value: string) {
        runInAction(() => {

            this._searchText = value ?? "";
            if(!this.isDropDownOpen) {
                this._dropDownController?.openDropDown();
            }
        });

    }

    private _clearFilter(): void {
        runInAction(() => {
            // we don't set the _currentInputText using the setter (this.currentInputText = "")
            // because in the setter we call this._dropDownController?.openDropDown(); and we will end up with
            // stack overflow exception
            this._searchText = "";
        });
    }

    private _moveUp(): void {
        if(this.currentFocusedItemIndex > 0) {
            this.currentFocusedItemIndex--;
        }
    }

    private _moveDown(): void {
        if(this.currentFocusedItemIndex < this.filteredItems.length - 1) {
            this.currentFocusedItemIndex++;
        }
    }


    private _onKeyDown = (event: KeyboardEvent) => {
        if(event.key === "ArrowDown") {
            this._moveDown();
        } else if(event.key === "ArrowUp") {
            this._moveUp();
        } else if(event.key === 'Enter') {
            event.preventDefault(); //we suppress enter so when we are in a form to not trigger the submit of the form
            event.stopPropagation();
            const item = this.filteredItems[this.currentFocusedItemIndex];
            if(item) {
                this.setSelectedItem(item);
            }

        } else if(event.key === 'Tab') {
            const item = this.filteredItems[this.currentFocusedItemIndex];
            if(item) {
                this.setSelectedItem(item);
            }
        }
    }

    private _setInputElementFocus () {
        this.options.inputElementRef.current?.focus();
    }

    private _onDropDownOpen = () => {
        this._setInputElementFocus();

        const inputContainerElement = this.options.inputContainerElementRef.current;
        if(inputContainerElement) {
            inputContainerElement.addEventListener('keydown', this._onKeyDown);
        }
    }
    private _onDropDownClose = () => {
        this._clearFilter();

        const inputContainerElement = this.options.inputContainerElementRef.current;
        if(inputContainerElement) {
            inputContainerElement.removeEventListener('keydown', this._onKeyDown);
        }
    }
}
