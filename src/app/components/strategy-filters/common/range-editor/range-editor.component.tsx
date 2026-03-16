import React from "react";
import {observer} from "mobx-react";
import {FilterLabelBox} from "../../boxes/filter-label.box";
import styled from "styled-components";
import {IonRange} from "@ionic/react";
import {FilterValueBox} from "../../boxes/filter-value.box";
import {FilterContainerComponent} from "../filter-container/filter-container.component";


const RangeBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: var(--ion-space-8);
`


interface RangeEditorComponentProps {
    label: string;
    min: number;
    max: number;
    lower: number;
    upper: number;
    onValueChanged: (value: {lower: number; upper: number}) => void;
    formatValue?: (value: number) => string;
}

export const RangeEditorComponent: React.FC<RangeEditorComponentProps> = observer((props) => {

    const formatValue = () => {
        if(props.formatValue) {
            return `${props.formatValue(props.lower)} - ${props.formatValue(props.upper)}`
        }

        return `${props.lower} - ${props.upper}`
    }

    return (
        <FilterContainerComponent>
            <FilterLabelBox>
                {props.label}
            </FilterLabelBox>
            <RangeBox>
                <IonRange dualKnobs={true}
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