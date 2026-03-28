import React, {ChangeEvent, useRef} from "react";
import {observer} from "mobx-react";
import {IonRangeBox, RangeBox} from "../../boxes/range.box";
import {FilterValueBox} from "../../boxes/filter-value.box";
import {FilterContainerComponent} from "../filter-container/filter-container.component";
import {FilterLabelComponent} from "../filter-label/filter-label.component";
import styled from "styled-components";
import {InputBaseBox} from "../../../input-base.box";
import {Check} from "../../../../../framework/utils/type-checking";
import {ITooltipController, TooltipComponent} from "../../../../../framework/components/tooltip/tooltip.component";
import {TooltipToggleBehaviorEnum} from "../../../../../framework/components/tooltip/tooltip-toggle-behavior.enum";
import {TooltipStandardContentBox} from "../../../../../framework/components/tooltip/tooltip-standard-content.box";
import {IonIcon} from "@ionic/react";
import {arrowForwardOutline} from "ionicons/icons";
import {ArrowBox} from "../boxes/arrow.box";


const InputBox = styled(InputBaseBox)`
    width: 100%;
    text-align: center;
`

const ValueEditorBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--ion-space-8);
    width: 100px;
`

interface ValueEditorComponentProps {
    value: number;
    min: number;
    max: number;
    onValueChanged: (value: number) => void;
}

const ValueEditorComponent: React.FC<ValueEditorComponentProps> = observer((props) => {
    const [value, setValue] = React.useState(props.value.toString());
    const onChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    }

    const onApplyChanges = () => {
        const valueAsNumber = parseFloat(value);
        if(Check.isNumber(valueAsNumber)) {
            if(props.min <= valueAsNumber && valueAsNumber <= props.max) {
                props.onValueChanged(valueAsNumber);
            }

        }
    }

    return (
        <ValueEditorBox>
            <InputBox value={value} onChange={onChanged}/>
            <ArrowBox onClick={onApplyChanges}>
                <IonIcon icon={arrowForwardOutline}/>
            </ArrowBox>
        </ValueEditorBox>
    )
})


interface SingleValueEditorComponentProps {
    label: string;
    min: number;
    max: number;
    step?: number;
    value: number;
    onValueChanged: (value: number) => void;
    formatValue?: (value: number) => string;
    tooltip?: string | React.ReactElement;
}


export const SingleValueEditorComponent: React.FC<SingleValueEditorComponentProps> = observer((props) => {
    const filterValueBoxRef = useRef<HTMLIonChipElement | null>(null)
    const tooltipRef = useRef<ITooltipController | null>(null)

    const onValueChangedFromTooltip = (val: number) => {
        props.onValueChanged(val);
        tooltipRef.current?.close();
    }

    return (
        <FilterContainerComponent>
            <FilterLabelComponent tooltip={props.tooltip}>
                {props.label}
            </FilterLabelComponent>
            <RangeBox>
                <IonRangeBox pin={true} step={props.step} min={props.min} max={props.max} value={props.value} onIonChange={e => {
                    props.onValueChanged(e.detail.value as number)
                }}/>
                <FilterValueBox ref={filterValueBoxRef}>
                    {props.formatValue ? props.formatValue(props.value) : props.value}
                </FilterValueBox>
                <TooltipComponent targetRef={filterValueBoxRef} toggleBehavior={TooltipToggleBehaviorEnum.OnTargetClick} tooltipControllerRef={tooltipRef}>
                    <TooltipStandardContentBox>
                        <ValueEditorComponent value={props.value} min={props.min} max={props.max} onValueChanged={onValueChangedFromTooltip}/>
                    </TooltipStandardContentBox>
                </TooltipComponent>
            </RangeBox>

        </FilterContainerComponent>
    )
})