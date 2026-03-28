import React, {ChangeEvent, useRef} from "react";
import {observer} from "mobx-react";
import styled from "styled-components";
import {FilterValueBox} from "../../boxes/filter-value.box";
import {FilterContainerComponent} from "../filter-container/filter-container.component";
import {FilterLabelComponent} from "../filter-label/filter-label.component";
import {IonRangeBox} from "../../boxes/range.box";
import {Check} from "../../../../../framework/utils/type-checking";
import {ArrowComponent} from "../boxes/arrow.box";
import {TooltipToggleBehaviorEnum} from "../../../../../framework/components/tooltip/tooltip-toggle-behavior.enum";
import {TooltipStandardContentBox} from "../../../../../framework/components/tooltip/tooltip-standard-content.box";
import {ITooltipController, TooltipComponent} from "../../../../../framework/components/tooltip/tooltip.component";
import {InputBox} from "../boxes/input.box";
import {ValuesEditorContainerBox} from "../boxes/values-editor-container.box";
import {renderError} from "../boxes/error.box";


const RangeBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`

interface RangeValuesEditorComponentProps {
    lower: number;
    upper: number;
    min: number;
    max: number;
    onValuesChanged: (values: {lower: number; upper: number}) => void
}

const RangeValuesEditorComponent: React.FC<RangeValuesEditorComponentProps> = observer((props) => {
    const [lower, setLower] = React.useState(props.lower.toString());
    const [upper, setUpper] = React.useState(props.upper.toString());
    const [error, setError] = React.useState("");

    const onLowerChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setLower(event.target.value);
        setError("")
    }

    const onUpperChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setUpper(event.target.value);
        setError("")
    }

    const parseValues = () => {
        if(Check.isEmpty(lower?.trim())) {
            setError(`First value is required`);
            return null;
        }

        if(Check.isEmpty(upper?.trim())) {
            setError(`Second value is required`);
            return null;
        }

        const lowerAsNumber = parseFloat(lower);
        if(!Check.isNumber(lowerAsNumber)) {
            setError(`${lower} is not a number`);
            return null;
        }

        const upperAsNumber = parseFloat(upper);
        if(!Check.isNumber(upperAsNumber)) {
            setError(`${upper} is not a number`);
            return null;
        }

        if(lowerAsNumber >= upperAsNumber) {
            setError(`First value must be less than second value`);
            return null;
        }

        if(!(props.min <= lowerAsNumber && lowerAsNumber <= props.max
            && props.min <= upperAsNumber && upperAsNumber <= props.max)) {
            setError(`Values must be in ${props.min} ↔ ${props.max} range`);
            return null;
        }

        return {
            lower: lowerAsNumber,
            upper: upperAsNumber
        };

    }

    const onApplyChanges = () => {

        const values = parseValues();
        if(values) {
            props.onValuesChanged(values);
        }
    }



    return (
        <ValuesEditorContainerBox>
            <InputBox value={lower} onChange={onLowerChanged}/>
            <span>
                ↔
            </span>
            <InputBox value={upper} onChange={onUpperChanged}/>
            <ArrowComponent onClick={onApplyChanges}/>
            {renderError(error)}
        </ValuesEditorContainerBox>
    )
})


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
    const filterValueBoxRef = useRef<HTMLIonChipElement | null>(null)
    const tooltipRef = useRef<ITooltipController | null>(null)
    const formatValue = () => {
        if(props.formatValue) {
            return `${props.formatValue(props.lower)} ↔ ${props.formatValue(props.upper)}`
        }

        return `${props.lower} ↔ ${props.upper}`
    }

    const onValuesChangedFromTooltip = (values: {lower: number; upper: number}) => {
        props.onValueChanged(values);
        tooltipRef.current?.close();
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
                <FilterValueBox ref={filterValueBoxRef}>
                    {formatValue()}
                </FilterValueBox>
                <TooltipComponent targetRef={filterValueBoxRef} toggleBehavior={TooltipToggleBehaviorEnum.OnTargetClick} tooltipControllerRef={tooltipRef}>
                    <TooltipStandardContentBox>
                        <RangeValuesEditorComponent lower={props.lower} upper={props.upper} min={props.min} max={props.max} onValuesChanged={onValuesChangedFromTooltip}/>
                    </TooltipStandardContentBox>
                </TooltipComponent>
            </RangeBox>

        </FilterContainerComponent>
    )
})