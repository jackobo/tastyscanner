import React, {ChangeEvent, useRef} from "react";
import {observer} from "mobx-react";
import {IonRangeBox, RangeBox} from "../../boxes/range.box";
import {FilterValueBox} from "../../boxes/filter-value.box";
import {FilterContainerComponent} from "../filter-container/filter-container.component";
import {FilterLabelComponent} from "../filter-label/filter-label.component";
import {Check} from "../../../../../framework/utils/type-checking";
import {ITooltipController, TooltipComponent} from "../../../../../framework/components/tooltip/tooltip.component";
import {TooltipToggleBehaviorEnum} from "../../../../../framework/components/tooltip/tooltip-toggle-behavior.enum";
import {TooltipStandardContentBox} from "../../../../../framework/components/tooltip/tooltip-standard-content.box";
import {InputBox} from "../boxes/input.box";
import {renderError} from "../boxes/error.box";
import {ValuesEditorContainerBox} from "../boxes/values-editor-container.box";
import {ArrowComponent} from "../boxes/arrow.box";


interface ValueEditorComponentProps {
    value: number;
    min: number;
    max: number;
    onValueChanged: (value: number) => void;
}

const ValueEditorComponent: React.FC<ValueEditorComponentProps> = observer((props) => {
    const [value, setValue] = React.useState(props.value.toString());
    const [error, setError] = React.useState("");
    const onChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
        setError("")
    }

    const parseValue = () => {
        const valueAsNumber = parseFloat(value);

        if(Check.isEmpty(value?.trim())) {
            setError(`Value is required`);
            return null;
        }

        if(!Check.isNumber(valueAsNumber)) {
            setError(`${value} is not a number`);
            return null;
        }

        if(!(props.min <= valueAsNumber && valueAsNumber <= props.max)) {
            setError(`Values must be in ${props.min} ↔ ${props.max} range`);
            return null;
        }

        return valueAsNumber;

    }

    const onApplyChanges = () => {
        const valueAsNumber = parseValue();
        if(Check.isNumber(valueAsNumber)) {
            props.onValueChanged(valueAsNumber);
        }
    }


    return (
        <ValuesEditorContainerBox>
            <InputBox value={value} onChange={onChanged}/>
            <ArrowComponent onClick={onApplyChanges}/>
            {renderError(error)}
        </ValuesEditorContainerBox>
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