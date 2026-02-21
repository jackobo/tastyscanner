import React from "react";
import {IFormField} from "../../../models/forms/form-field.interface";
import {NullableNumber} from "../../../types/nullable-types";
import {observer} from "mobx-react";
import styled from "styled-components";
import {FieldInputContainerComponent} from "../field-input-container.component";
import {FieldEditorCommonProps} from "../inputs-common.props";
import {InputBaseBox} from "../../input/input-base.box";
import {Check} from "../../../utils/type-checking";

const NumericInputBox = styled(InputBaseBox)`
`

interface NumericFieldEditorComponentProps extends FieldEditorCommonProps {
    field: IFormField<NullableNumber>;
    inputMode: 'numeric' | 'decimal';
    placeholder?: string;
    minValue?: number;
    maxValue?: number;
}

export const NumericFieldEditorComponent: React.FC<NumericFieldEditorComponentProps> = observer((props) => {
    const isReadOnly = props.isReadonly || props.field.isReadOnly;
    const setValue = (value: number) => {
        const currentFieldValue = props.field.value;
        if(!Check.isNullOrUndefined(props.maxValue)) {
            if(value > props.maxValue) {
                props.field.setValue(currentFieldValue);
                return;
            }
        }

        if(!Check.isNullOrUndefined(props.minValue)) {
            if(value < props.minValue) {
                props.field.setValue(currentFieldValue);
                return;
            }
        }

        props.field.setValue(value);
    }

    const parseValue = (value: string | number | null | undefined) => {
        if(Check.isNullOrUndefined(value)) {
            props.field.setValue(null);
        } else if(Check.isNumber(value)) {
            setValue(value);
        } else {
            let valueAsNumber: NullableNumber;
            if(props.inputMode === 'decimal') {
                valueAsNumber = parseFloat(value);
            } else {
                valueAsNumber = parseInt(value);
            }

            if(Check.isNumber(valueAsNumber)) {
                setValue(valueAsNumber);
            } else {
                props.field.setValue(null);
            }
        }
    }

    const renderInput = () => {
        return (
            <NumericInputBox    type={"number"}
                                inputMode={props.inputMode}
                                value={props.field.value || ""}
                                min={props.minValue}
                                max={props.maxValue}
                                placeholder={props.placeholder}
                                onChange={(e) => parseValue(e.target.value)}
                                readOnly={isReadOnly}
                                ref={props.field.attachInputDOMElement}/>
        );
    }

    return (
        <FieldInputContainerComponent {...props} isReadonly={isReadOnly} renderInput={renderInput}/>
    );
});
