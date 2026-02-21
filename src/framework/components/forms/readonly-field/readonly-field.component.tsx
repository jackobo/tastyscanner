import React from "react";
import {observer} from "mobx-react";
import {NullableUndefinedString} from "../../../types/nullable-types";
import styled from "styled-components";

const FieldContainerBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: var(--ion-space-8);
    width: 100%;
`

const FieldLabelBox = styled.div`
    display: flex;
    flex-direction: column;
    padding-left: 4px;
`

const FieldValueBox = styled.div`
    display: flex;
    flex-direction: column;
    background-color: var(--ion-color-light);
    color: var(--ion-color-medium);
    width: 100%;
    padding: var(--ion-space-20) var(--ion-space-16);
    border-radius: var(--ion-border-radius);
`

interface ReadonlyFieldComponentProps {
    fieldLabel: string;
    fieldValue: NullableUndefinedString;
}
export const ReadonlyFieldComponent: React.FC<ReadonlyFieldComponentProps> = observer((props) => {
    return (
        <FieldContainerBox>
            <FieldLabelBox>
                {props.fieldLabel}
            </FieldLabelBox>
            <FieldValueBox>
                {props.fieldValue}
            </FieldValueBox>
        </FieldContainerBox>
    )
})