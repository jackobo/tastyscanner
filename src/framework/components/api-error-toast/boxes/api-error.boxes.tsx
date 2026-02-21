import styled from "styled-components";
import React from "react";
import {observer} from "mobx-react";

const ApiErrorFieldBox = styled.div<{$flexDirection: string}>`
    display: flex;
    flex-direction: ${props => props.$flexDirection};
    width: 100%;
    gap: 4px;
`

const ApiErrorFieldLabelBox = styled.div`
    font-weight: var(--ion-font-weight-bold);
`

const ApiErrorFieldValueBox = styled.div`
    font-style: italic;
`

interface ApiErrorFieldComponentProps {
    label: string;
    value: string | React.ReactElement;
    orientation?: 'vertical' | 'horizontal';
}

export const ApiErrorFieldComponent: React.FC<ApiErrorFieldComponentProps> = observer((props) => {
    const orientation = props.orientation ?? "vertical";
    return (
        <ApiErrorFieldBox $flexDirection={orientation === "vertical" ? "column" : "row"}>
            <ApiErrorFieldLabelBox>
                {props.label}
            </ApiErrorFieldLabelBox>
            <ApiErrorFieldValueBox>
                {props.value}
            </ApiErrorFieldValueBox>

        </ApiErrorFieldBox>
    )
})