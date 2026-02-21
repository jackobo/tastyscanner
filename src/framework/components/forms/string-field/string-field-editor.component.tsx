import React from "react";
import {IFormField} from "../../../models/forms/form-field.interface";
import {observer} from "mobx-react";
import {NullableString} from "../../../types/nullable-types";
import styled from "styled-components";

import {FieldInputContainerComponent} from "../field-input-container.component";
import {FieldEditorCommonProps} from "../inputs-common.props";
import { FieldInputWrapperBox } from "../field-input-wrapper.box";
import {InputBaseBox} from "../../input/input-base.box";
import {Check} from "../../../utils/type-checking";

const InputBox = styled(InputBaseBox)`
`

interface StringFieldEditorComponentProps extends FieldEditorCommonProps {
    field: IFormField<NullableString>;
    placeholder?: NullableString;
    inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
    type?: 'date' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url' | 'time' | 'week' | 'month' | 'datetime-local';
    iconRight?: React.ReactElement;
    className?: string;
}


export const StringFieldEditorComponent: React.FC<StringFieldEditorComponentProps> = observer((props) => {

    const placeholder = props.placeholder ? props.placeholder : "";
    const isReadOnly = Boolean(props.isReadonly) || props.field.isReadOnly;

    let autoCapitalize = 'off';
    if(props.field.autoCapitalize) {
        autoCapitalize = "characters";
    }

    const setValue = (value: string | number | null | undefined) => {
        if(Check.isNullOrUndefined(value) || Check.isEmpty(value)) {
            props.field.setValue(null);
        } else {
            props.field.setValue(value.toString());
        }
    }

    const renderInput = () => {
        return (
            <FieldInputWrapperBox>
                <InputBox  type={props.type}
                           inputMode={props.inputMode}
                           autoComplete="off"
                           autoCorrect="off"
                           autoCapitalize={autoCapitalize}
                           spellCheck={false}
                           ref={props.field.attachInputDOMElement}
                           placeholder={placeholder}
                           value={props.field.value ?? ""}
                           maxLength={props.field.maxLength}
                           readOnly={isReadOnly}
                           onChange={(e) => setValue(e.target.value)}
                           className={props.className}/>
                {props.iconRight}
            </FieldInputWrapperBox>
        );
    }


    return (
        <FieldInputContainerComponent {...props} isReadonly={isReadOnly} renderInput={renderInput} />
    );
});
