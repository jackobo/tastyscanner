import React, {ChangeEvent, useRef} from "react";
import {observer} from "mobx-react";
import styled from "styled-components";
import {FilterValueBox} from "../../boxes/filter-value.box";
import {FilterContainerComponent} from "../filter-container/filter-container.component";
import {FilterLabelComponent} from "../filter-label/filter-label.component";
import {IonRangeBox} from "../../boxes/range.box";
import {InputBaseBox} from "../../../input-base.box";
import {Check} from "../../../../../framework/utils/type-checking";
import {ArrowBox} from "../boxes/arrow.box";
import {IonIcon} from "@ionic/react";
import {arrowForwardOutline} from "ionicons/icons";
import {TooltipToggleBehaviorEnum} from "../../../../../framework/components/tooltip/tooltip-toggle-behavior.enum";
import {TooltipStandardContentBox} from "../../../../../framework/components/tooltip/tooltip-standard-content.box";
import {ITooltipController, TooltipComponent} from "../../../../../framework/components/tooltip/tooltip.component";


const RangeBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`

const ValuesEditorContainerBox = styled.div`
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--ion-space-8);
    width: 200px;
`


const InputBox = styled(InputBaseBox)`
    width: 100%;
    text-align: center;
`

const ErrorBox = styled.div`
    position: absolute;
    bottom: 0;
    left: 4px;
    transform: translateY(100%);
    color: var(--ion-color-danger);
    font-size: var(--ion-font-size-caption);
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
            setError(`First value must be lower than second value`);
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

    const renderError = () => {
        if(!error) {
            return null;
        }

        return (
            <ErrorBox>
                {error}
            </ErrorBox>
        )
    }

    return (
        <ValuesEditorContainerBox>
            <InputBox value={lower} onChange={onLowerChanged}/>
            <span>
                ↔
            </span>
            <InputBox value={upper} onChange={onUpperChanged}/>
            <ArrowBox onClick={onApplyChanges}>
                <IonIcon icon={arrowForwardOutline}/>
            </ArrowBox>
            {renderError()}
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