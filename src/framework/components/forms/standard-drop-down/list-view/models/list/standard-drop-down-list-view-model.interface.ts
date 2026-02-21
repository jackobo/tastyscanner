import {IStandardDropDownItemViewModel} from "../item/standard-drop-down-list-item-view-model.interface";
import {IDropDownController} from "../../../../drop-down/models/drop-down-controller.interface";
import {IFormField} from "../../../../../../models/forms/form-field.interface";


export interface IStandardDropDownListViewModel<TFieldValue> {
    searchText: string;
    currentFocusedItemIndex: number;
    readonly filteredItems: IStandardDropDownItemViewModel<TFieldValue>[];
    readonly unfilteredItemsCount: number;
    readonly selectedItem: IStandardDropDownItemViewModel<TFieldValue> | null;
    readonly isDropDownOpen: boolean;
    readonly isInsideModalDialog: boolean;

    setSelectedItem(item: IStandardDropDownItemViewModel<TFieldValue>): void;
    clearSelectedItem(): void;
    updateField(field:  IFormField<TFieldValue>): void;
    setDropDownController(controller: IDropDownController): void;
}
