import React from "react";
import {observer} from "mobx-react";
import {IonRangeBox, RangeBox} from "../../boxes/range.box";
import {FilterValueBox} from "../../boxes/filter-value.box";
import {FilterContainerComponent} from "../filter-container/filter-container.component";
import {FilterLabelComponent} from "../filter-label/filter-label.component";


interface SingleValueEditorComponentProps {
    label: string;
    min: number;
    max: number;
    value: number;
    onValueChanged: (value: number) => void;
    formatValue?: (value: number) => string;
    tooltip?: string | React.ReactElement;
}
export const SingleValueEditorComponent: React.FC<SingleValueEditorComponentProps> = observer((props) => {
    return (
        <FilterContainerComponent>
            <FilterLabelComponent tooltip={props.tooltip}>
                {props.label}
            </FilterLabelComponent>
            <RangeBox>
                <IonRangeBox pin={true} min={props.min} max={props.max} value={props.value} onIonChange={e => {
                    props.onValueChanged(e.detail.value as number)
                }}/>
                <FilterValueBox>
                    {props.formatValue ? props.formatValue(props.value) : props.value}
                </FilterValueBox>
            </RangeBox>

        </FilterContainerComponent>
    )
})