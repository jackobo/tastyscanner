import React, {FocusEvent, MouseEvent, RefObject, useEffect, useRef} from "react";
import {observer} from "mobx-react";
import {FieldEditorCommonProps, FieldInputContainerComponentProps} from "../inputs-common.props";
import {IFormField} from "../../../models/forms/form-field.interface";
import {TimeOnly} from "../../../types/time-only";
import {MaskOptions, Replacement, useMask} from "@react-input/mask";
import {InputBaseBox} from "../../input/input-base.box";
import {FieldInputContainerComponent} from "../field-input-container.component";
import {TimeOnlyInputParser} from "./time-only-input-parser";
import {TimeOnlyInputTracker} from "./time-only-input-tracker";
import {TimeOnlyMask} from "./time-only-mask.enum";
import {useFrameworkServices} from "../../../hooks/use-framework-services.hook";


const digitRegEx = /\d/

const maskReplacement = {
    _: digitRegEx,
    ".": /\//,
    s: / /,
    c: /:/
};



const Placeholder = {
    [TimeOnlyMask.HHMM]: "HH:mm",
    [TimeOnlyMask.HHMMSS]: "HH:mm:ss",
}

interface TimeOnlyEditorComponentProps extends FieldEditorCommonProps {
    field: IFormField<TimeOnly>;
    mask?: TimeOnlyMask;
    isUtc?: boolean;
}


export const TimeOnlyEditorComponent: React.FC<TimeOnlyEditorComponentProps> = observer((props) => {
    const services = useFrameworkServices();
    const ignoreFieldChangeEventRef = useRef(false);
    const [currentInputValue, setCurrentInputValue] = React.useState<string>("");

    const {mask, isUtc, ...commonFieldInputProps} = props;

    const isReadOnly = props.isReadonly || props.field.isReadOnly;
    const maskNonNull = mask ?? TimeOnlyMask.HHMM;
    const maskOptions: MaskOptions = {
        mask: maskNonNull,
        replacement: maskReplacement,
        showMask: false,
        separate: true,
        track: params => {
            const inputTracker = new TimeOnlyInputTracker(params);
            return inputTracker.track();
        }
    };

    const inputRef: RefObject<HTMLInputElement> = useMask(maskOptions) as RefObject<HTMLInputElement>;
    const timeParser = useRef(new TimeOnlyInputParser(services, {
        mask: maskNonNull,
        replacement: maskOptions.replacement as Replacement,
        isUtc: Boolean(isUtc),
    }));


    useEffect(() => {
        const subscription = props.field.onChange((newValue) => {
            if(!ignoreFieldChangeEventRef.current) {
                if (newValue) {
                    inputRef.current.value = timeParser.current.formatValue(newValue);
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
            const parseResult = timeParser.current.parseValue(inputValue);
            props.field.setCustomError(parseResult.error);
            props.field.setValue(parseResult.value);
            if(setInputValueAlso) {
                inputRef.current.value = parseResult.formattedValue ?? "";
            }
        } catch(err) {
            services.logger.error('Failed to set time field value', err);
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


    const renderInput = () => {
        let defaultValue: string = "";
        if(props.field.value) {
            defaultValue = timeParser.current.formatValue(props.field.value);
        }

        return (<InputBaseBox ref={inputRef}
                              placeholder={Placeholder[maskNonNull]}
                              defaultValue={defaultValue}
                              readOnly={isReadOnly}
                              onBlur={onBlur}
                              onChange={onChange} />)
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