import React, {MouseEvent, useEffect, useRef} from 'react';
import {observer} from "mobx-react";
import {StandardDropDownListModel} from "./list-view/models/list/standard-drop-down-list.model";
import {IDropDownController} from "../drop-down/models/drop-down-controller.interface";
import {StandardDropDownInputComponent} from "./list-view/components/input/standard-drop-down-input.component";
import {StandardDropDownListComponent} from "./list-view/components/list/standard-drop-down-list.component";
import {DropDownComponent} from "../drop-down/drop-down.component";
import {FieldEditorCommonProps} from "../inputs-common.props";
import {IFormField} from "../../../models/forms/form-field.interface";
import {IStandardDropDownItemViewModel} from "./list-view/models/item/standard-drop-down-list-item-view-model.interface";
import {InputContainerComponent} from "../input-container/input-container.component";
import {IDropDownPopperOptions} from "../drop-down/components/popper/drop-down-popper-options";
import {InputLabelRendererType} from "../input-label-renderer.type";
import styled from "styled-components";
import {InputBaseBox} from "../../input/input-base.box";
import {useFrameworkServices} from "../../../hooks/use-framework-services.hook";


const DialogHeaderBox = styled.div`
    padding-bottom: var(--ion-space-12);
`

interface DialogHeaderComponentProps<TFieldValue> {
    listModel: StandardDropDownListModel<TFieldValue>;
    hideSearchBar?: boolean;
}


const DialogHeaderComponent = observer(<TFieldValue extends any>(props: DialogHeaderComponentProps<TFieldValue>) => {

    /*
    const captureInputElementRef = (el: HTMLInputElement | null) => {
        if(el) {
            setElementFocus(el);
        }
    }

     */

    if(props.hideSearchBar) {
        return null;
    }

    /*
    const onSearch = (text: string) => {
        props.listModel.searchText = (text);
    }
     */


    return (
        <DialogHeaderBox>
            {
                /*
                <SearchbarComponent captureInputElementRef={captureInputElementRef}
                                onChange={onSearch} />
                */
            }
        </DialogHeaderBox>

    );
});

interface IStandardDropDownModalDialogOptions {
    renderTitle?: InputLabelRendererType;
    hideSearchBar?: boolean;
}

interface StandardDropDownComponentProps<TFieldValue> extends FieldEditorCommonProps {
    field: IFormField<TFieldValue>;
    items: IStandardDropDownItemViewModel<TFieldValue>[];
    placeholder?: string;
    hidePlaceholderWhenDropDownOpen?: boolean;
    noItemsMessage?: () => React.ReactElement | string;
    modalDialogOptions?: IStandardDropDownModalDialogOptions;
    popperOptions?: IDropDownPopperOptions;
    hideChevron?: boolean;
    inputClassName?: string;
    showClearButton?: boolean;
}


export const StandardDropDownComponent = observer(<TFieldValue extends any>(props: StandardDropDownComponentProps<TFieldValue>) => {
    const services = useFrameworkServices();
    const inputElementRef = useRef<HTMLElement | null>(null);
    const inputContainerElementRef = useRef<HTMLElement | null>(null);
    const listModelRef = useRef( new StandardDropDownListModel<TFieldValue>({
        field: props.field,
        services: services,
        initialItems: props.items,
        inputElementRef: inputElementRef,
        inputContainerElementRef: inputContainerElementRef
    }));

    const isReadOnly = props.isReadonly || props.field.isReadOnly;

    const hidePlaceholderWhenDropDownOpen = props.hidePlaceholderWhenDropDownOpen ?? true;

    const listModel = listModelRef.current;

    useEffect(() => {
        listModel.updateItems(props.items)
    }, [props.items, listModel]);

    useEffect(() => {
        listModel.updateField(props.field);
    }, [props.field, listModel]);

    if(props.field.isHidden) {
        return null;
    }

    const captureInputContainerRef = (element: HTMLDivElement) => {
        props.field.attachContainerDOMElement(element);
        inputContainerElementRef.current = element;
        if(props.captureInputContainerRef) {
            props.captureInputContainerRef(element);
        }
    }

    const captureInputElementRef = (element: any) => {
        inputElementRef.current = element;
        props.field.attachInputDOMElement(element);
    }

    const renderLabel = () => {
        if(props.renderLabel) {
            const renderLabelProp = props.renderLabel;
            return () => renderLabelProp();
        }
        return () => props.field.fieldName;
    }


    const renderDropDownInput = (controller: IDropDownController) => {
        listModel.setDropDownController(controller);

        const getPlaceholder = () => {
            if(controller.isOpen && hidePlaceholderWhenDropDownOpen) {
                return undefined;
            }
            return props.placeholder;
        }

        return (
            <StandardDropDownInputComponent captureInputRef={captureInputElementRef}
                                            listViewModel={listModel}
                                            placeHolder={getPlaceholder()}
                                            className={props.inputClassName}
                                            showClearButton={props.showClearButton}/>
        );


    }


    const renderDropDownContent = (controller: IDropDownController) => {
        listModel.setDropDownController(controller);
        const DropDownList = StandardDropDownListComponent<TFieldValue>;
        return (
            <DropDownList listViewModel={listModel}
                          renderEmptyListMessage={props.noItemsMessage}/>
        );

    }

    const renderDialogHeader = () => {
        const Component = DialogHeaderComponent<TFieldValue>;
        return (
            <Component listModel={listModel} hideSearchBar={props.modalDialogOptions?.hideSearchBar}/>
        );
    }

    const renderReadonlyInput = () => {
        const selectedItemText = listModel.selectedItem?.getDropDownDisplayText() ?? "";
        return (
            <InputBaseBox
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                ref={props.field.attachInputDOMElement}
                placeholder={props.placeholder}
                value={selectedItemText}
                maxLength={props.field.maxLength}
                readOnly={true}
                className={props.className}/>
        );
    }

    if(isReadOnly) {
        return (
            <InputContainerComponent renderInput={renderReadonlyInput}
                                     renderLabel={renderLabel()}
                                     errorMessage={props.field.activatedError}
                                     captureInputContainerRef={captureInputContainerRef}
                                     onClick={props.onClick}
                                     className={props.className}
                                     hideErrorMessage={props.hideErrorMessage}
                                     isReadonly={isReadOnly}/>
        );
    }

    const showClearButton = Boolean(props.showClearButton && listModel.selectedItem);

    const onClearButtonClick = (event: MouseEvent<HTMLDivElement>) => {
        if(props.onClearButtonClick) {
            props.onClearButtonClick(event)
        }
        if(event.isDefaultPrevented() || event.isPropagationStopped()) return;
        event.preventDefault();
        event.stopPropagation();
        listModel.clearSelectedItem();
        inputElementRef.current?.focus();
    }

    return (
        <DropDownComponent {...props}
                           showClearButton={showClearButton}
                           onClearButtonClick={onClearButtonClick}
                           renderLabel={renderLabel()}
                           errorMessage={props.field.activatedError}
                           renderDropDownInput={renderDropDownInput}
                           renderDropDownContent={renderDropDownContent}
                           dropDownContentIsInActionSheet={false}
                           captureInputContainerRef={captureInputContainerRef}
                           modalDialogOptions={{
                               renderTitle: props.modalDialogOptions?.renderTitle,
                               renderHeaderContent: renderDialogHeader,
                           }}
                           popperOptions={props.popperOptions}/>
    )
});
