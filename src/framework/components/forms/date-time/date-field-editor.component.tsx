import React, {FocusEvent, MouseEvent, RefObject, useEffect, useRef} from "react";
import {observer} from "mobx-react";
import {FieldInputContainerComponent} from "../field-input-container.component";
import {FieldEditorCommonProps, FieldInputContainerComponentProps} from "../inputs-common.props";
import {IFormField} from "../../../models/forms/form-field.interface";
import {NullableDate, NullableUndefinedDate} from "../../../types/nullable-types";
import {MaskOptions, Replacement, useMask} from '@react-input/mask';
import {DateInputParser} from "./date-input-parser";
import {DateInputTracker} from "./date-input-tracker";
import {InputBaseBox} from "../../input/input-base.box";
import {DateFieldMask} from "./date-field-mask.enum";
import {useFrameworkServices} from "../../../hooks/use-framework-services.hook";
import styled from "styled-components";
import {calendarOutline} from "ionicons/icons";
import {IonDatetime, IonIcon, IonPopover} from "@ionic/react";

const InputWrapperBox = styled.div`
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
`

const CalendarIconBox = styled.div`
    position: absolute;
    right: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 20px;
    z-index: 1;
`


const digitRegEx = /\d/

const maskReplacement = {
    _: digitRegEx,
    ".": /\//,
    s: / /,
    c: /:/
};




const Placeholder = {
    [DateFieldMask.DDMMYYYY]: "dd/mm/yyyy",
    [DateFieldMask.DDMMYYYYhhmm]: "dd/mm/yyyy hh:mm",
    [DateFieldMask.DDMMYYYYhhmmss]: "dd/mm/yyyy hh:mm:ss",
}
interface DateFieldEditorWithInputMaskComponentProps extends FieldEditorCommonProps {
    field: IFormField<NullableDate>;
    mask?: DateFieldMask;
    minDate?: NullableUndefinedDate;
    maxDate?: NullableUndefinedDate
}



export const DateFieldEditorComponent: React.FC<DateFieldEditorWithInputMaskComponentProps> = observer((props) => {
    const services = useFrameworkServices();
    const ignoreFieldChangeEventRef = useRef(false);
    const [currentInputValue, setCurrentInputValue] = React.useState<string>("");
    const {mask, minDate, maxDate, ...commonFieldInputProps} = props;
    const maskNonNull = mask ?? DateFieldMask.DDMMYYYY;
    const isReadOnly = props.isReadonly || props.field.isReadOnly;

    const maskOptions: MaskOptions = {
        mask: maskNonNull,
        replacement: maskReplacement,
        showMask: false,
        separate: true,
        track: params => {
            const inputTracker = new DateInputTracker(params);
            return inputTracker.track();
        }
    };

    const inputRef: RefObject<HTMLInputElement> = useMask(maskOptions) as RefObject<HTMLInputElement>;
    const dateParser = useRef(new DateInputParser(services, {
        mask: maskNonNull,
        replacement: maskOptions.replacement as Replacement,
        minDate: minDate,
        maxDate: maxDate,
    }));


    useEffect(() => {
        const subscription = props.field.onChange((newValue) => {
            if(!ignoreFieldChangeEventRef.current) {
                if (newValue) {
                    inputRef.current.value = dateParser.current.formatValue(newValue);
                } else {
                    inputRef.current.value = "";
                }
            }
        });

        if(inputRef.current) {
            props.field.attachInputDOMElement(inputRef.current);
        }


        return () => {
            subscription.unsubscribe();
        }

    }, [inputRef, props.field]);

    const setFieldValue = (inputValue: string, setInputValueAlso: boolean) => {
        ignoreFieldChangeEventRef.current = true;
        try {
            const parseResult = dateParser.current.parseValue(inputValue);
            props.field.setCustomError(parseResult.error);
            props.field.setValue(parseResult.value);
            if(setInputValueAlso) {
                inputRef.current.value = parseResult.formattedValue ?? "";
            }
        } catch(err) {
            services.logger.error('Failed to set date field value', err);
        } finally {
            ignoreFieldChangeEventRef.current = false;
        }
    }

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(isReadOnly) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            setFieldValue(event.target.value, false);
            setCurrentInputValue(event.target.value);
        }

    }

    const onBlur = (event: FocusEvent<HTMLInputElement>)=> {
        if(!isReadOnly) {
            setFieldValue(event.target.value, true);
        }
    }

    const renderCalendar = () => {
        if(isReadOnly) {
            return null;
        }

        const onCalendarDateTimeChanged = (value: any) => {
            if(value) {
                props.field.setValue(services.time.parseIsoDate(value))
            } else {
                props.field.setValue(null);
            }
        }

        const currentValue = props.field.value?.toISOString();
        const minDate = props.minDate?.toISOString() ?? undefined;
        const maxDate = props.maxDate?.toISOString() ?? undefined;

        const calendarIconId = `date-field-calendar-icon-${props.field.fieldName}`;
        const popoverId = `date-field-popover-${props.field.fieldName}`;
        return (
            <>
                <CalendarIconBox id={calendarIconId}>
                    <IonIcon icon={calendarOutline}/>
                </CalendarIconBox>
                <IonPopover key={popoverId}
                            id={popoverId}
                            trigger={calendarIconId}
                            triggerAction="click"
                            showBackdrop={false}>
                    <IonDatetime value={currentValue}
                                 preferWheel={false}
                                 showClearButton={true}
                                 showDefaultButtons={true}
                                 presentation={props.mask === DateFieldMask.DDMMYYYY ? "date" : "date-time"}
                                 firstDayOfWeek={0}
                                 min={minDate}
                                 max={maxDate}
                                 onIonChange={(e) => onCalendarDateTimeChanged(e.detail.value)}/>
                </IonPopover>
            </>
        );
    }

    const renderInput = () => {
        let defaultValue: string = "";
        if(props.field.value) {
            defaultValue = dateParser.current.formatValue(props.field.value!);
        }
        return (
            <InputWrapperBox>
                <InputBaseBox ref={inputRef}
                              placeholder={Placeholder[maskNonNull]}
                              defaultValue={defaultValue}
                              readOnly={isReadOnly}
                              onBlur={onBlur}
                              onChange={onChange}  />
                {renderCalendar()}
            </InputWrapperBox>
        );

    }

    const onClearButtonClick = (event: MouseEvent<HTMLDivElement>)=> {
        if(props.onClearButtonClick) {
            props.onClearButtonClick(event);
        }

        if(event.isDefaultPrevented() || event.isPropagationStopped()) {
            return;
        }

        props.field.clear();
        inputRef.current.value = "";
        setCurrentInputValue("");
    }

    const forceClearButton = props.showClearButton && (Boolean(currentInputValue) || Boolean(props.field.value ?? undefined));

    const fieldContainerProps: FieldInputContainerComponentProps = {
        ...commonFieldInputProps,
        renderInput: renderInput,
        onClearButtonClick: onClearButtonClick,
        forceClearButton: forceClearButton,
        showClearButton: forceClearButton,
        isReadonly: isReadOnly
    };

    return (
        <FieldInputContainerComponent {...fieldContainerProps}/>
    );
})


