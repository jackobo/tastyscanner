import React from "react";
import {observer} from "mobx-react";
import styled from "styled-components";
import {FilterContainerBox} from "../../boxes/filter-container.box";
import {FilterLabelBox} from "../../boxes/filter-label.box";
import {IonRange} from "@ionic/react";
import {RangeBox} from "../../boxes/range.box";
import {FilterValueBox} from "../../boxes/filter-value.box";


interface SingleValueEditorComponentProps {
    label: string;
    min: number;
    max: number;
    value: number;
    onValueChanged: (value: number) => void;
    formatValue?: (value: number) => string;
}
export const SingleValueEditorComponent: React.FC<SingleValueEditorComponentProps> = observer((props) => {
    return (
        <FilterContainerBox>
            <FilterLabelBox>
                {props.label}
            </FilterLabelBox>
            <RangeBox>
                <IonRange pin={true} min={props.min} max={props.max} value={props.value} onIonChange={e => {
                    props.onValueChanged(e.detail.value as number)
                }}/>
                <FilterValueBox>
                    {props.formatValue ? props.formatValue(props.value) : props.value}
                </FilterValueBox>
            </RangeBox>

        </FilterContainerBox>
    )
})