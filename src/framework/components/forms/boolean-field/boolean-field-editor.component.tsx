import React from "react";
import {observer} from "mobx-react";
import {IFormField} from "../../../models/forms/form-field.interface";
import styled, {css} from "styled-components";
import {FieldInputContainerComponent} from "../field-input-container.component";
import {
    FieldEditorCommonProps,
} from "../inputs-common.props";
import { FieldLabelBox } from "../field-label.box";
import {CheckboxComponent, CheckBoxLabelPlacement} from "../../checkbox/checkbox.component";

const ContainerBox = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    align-items: flex-end;
    
`

const CheckBoxLabelBox = styled(FieldLabelBox)<{$hasHtmlContent: boolean; $hasError: boolean}>`
    font-weight: var(--ion-font-weight-regular);
    ${props => props.$hasHtmlContent  && !props.$hasError
            ? css`
                color: var(--ion-color-medium);
            `
            : ``
    }
    margin-bottom: 0;
`

interface BooleanFieldEditorComponentProps extends FieldEditorCommonProps {
    field: IFormField<boolean>;
    labelPlacement?: CheckBoxLabelPlacement;
    labelHtml?: string;
}
export const BooleanFieldEditorComponent: React.FC<BooleanFieldEditorComponentProps> = observer((props) => {
    const renderLabel = () => {

        if(props.labelHtml) {
            return (
                <CheckBoxLabelBox $hasHtmlContent={true} $hasError={props.field.hasError} dangerouslySetInnerHTML={{
                    __html: props.labelHtml
                }}/>
            );
        }

        return (
            <CheckBoxLabelBox $hasError={props.field.hasError} $hasHtmlContent={false}>
                {props.field.fieldName}
            </CheckBoxLabelBox>
        );
    }

    const renderCheck = () => {
        return (
            <CheckboxComponent checked={props.field.value || false}
                               isReadOnly={props.field.isReadOnly}
                               onChange={isChecked => props.field.setValue(isChecked)}
                               label={renderLabel()}
                               labelPlacement={props.labelPlacement ?? "end"}/>
        );
    }


    return (
        <ContainerBox>
            <FieldInputContainerComponent {...props} hideLabel={true} renderInput={renderCheck}/>
        </ContainerBox>

    );
});
