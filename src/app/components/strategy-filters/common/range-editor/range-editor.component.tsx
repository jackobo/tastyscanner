import React from "react";
import {observer} from "mobx-react";
import styled from "styled-components";
import {FilterValueBox} from "../../boxes/filter-value.box";
import {FilterContainerComponent} from "../filter-container/filter-container.component";
import {FilterLabelComponent} from "../filter-label/filter-label.component";
import {IonRangeBox} from "../../boxes/range.box";


const RangeBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    
`


interface RangeEditorComponentProps {
    label: string;
    min: number;
    max: number;
    lower: number;
    upper: number;
    onValueChanged: (value: {lower: number; upper: number}) => void;
    formatValue?: (value: number) => string;
    tooltip?: string | React.ReactElement;
}

export const RangeEditorComponent: React.FC<RangeEditorComponentProps> = observer((props) => {

    const formatValue = () => {
        if(props.formatValue) {
            return `${props.formatValue(props.lower)} ↔ ${props.formatValue(props.upper)}`
        }

        return `${props.lower} ↔ ${props.upper}`
    }

    return (
        <FilterContainerComponent>
            <FilterLabelComponent tooltip={props.tooltip}>
                {props.label}
            </FilterLabelComponent>
            <RangeBox>
                <IonRangeBox dualKnobs={true}
                          min={props.min}
                          max={props.max}
                          value={{lower: props.lower, upper: props.upper}}
                          pin={true}
                          onIonChange={e => {
                              const range = e.detail.value as any;
                              props.onValueChanged({lower: range.lower, upper: range.upper})
                          }}/>
                <FilterValueBox>
                    {formatValue()}
                </FilterValueBox>
            </RangeBox>

        </FilterContainerComponent>
    )
})