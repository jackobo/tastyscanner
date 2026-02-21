import React, {ChangeEvent} from "react";
import {observer} from "mobx-react";
import {IStandardDropDownListViewModel} from "../../models/list/standard-drop-down-list-view-model.interface";
import styled from "styled-components";

import {InputBaseBox} from "../../../../../input/input-base.box";


const InputBox = styled(InputBaseBox)`
    
`


interface StandardDropDownInputComponentProps<TFieldValue> {
    listViewModel: IStandardDropDownListViewModel<TFieldValue>
    captureInputRef: (element: HTMLInputElement) => void;
    placeHolder?: string;
    className?: string;
    showClearButton?: boolean;
}

export const StandardDropDownInputComponent = observer(<TFieldValue extends any>(props: StandardDropDownInputComponentProps<TFieldValue>) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        props.listViewModel.searchText = event.target.value ?? "";
    }

    const captureInputElementRef = (element: HTMLInputElement) => {
        inputRef.current = element;
        props.captureInputRef(element);
    }

    const getInputPlaceHolder = () => {
        if(props.listViewModel.isDropDownOpen) {
            return props.listViewModel.selectedItem?.getDropDownDisplayText() ?? props.placeHolder ?? "";
        } else {
            return props.placeHolder ?? "";
        }
    }

    return (
        <InputBox ref={captureInputElementRef}
                  autoComplete="off"
                  readOnly={false}
                  value={props.listViewModel.searchText}
                  placeholder={getInputPlaceHolder()}
                  onChange={onInputChange}
                  className={props.className} />
    )


});
