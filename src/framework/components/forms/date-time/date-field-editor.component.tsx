import React, {FocusEvent, MouseEvent, RefObject, useEffect, useRef} from "react";
import {observer} from "mobx-react";
import {FieldInputContainerComponent} from "../field-input-container.component";
import {FieldEditorCommonProps, FieldInputContainerComponentProps} from "../inputs-common.props";
import {IFormField} from "../../../models/forms/form-field.interface";
import {NullableDate, NullableUndefinedDate} from "../../../types/nullable-types";
import { useMask, MaskOptions, Replacement} from '@react-input/mask';
import {DateInputParser} from "./date-input-parser";
import {DateInputTracker} from "./date-input-tracker";
import {InputBaseBox} from "../../input/input-base.box";
import {DateFieldMask} from "./date-field-mask.enum";
import {useFrameworkServices} from "../../../hooks/use-framework-services.hook";


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


    const renderInput = () => {
        let defaultValue: string = "";
        if(props.field.value) {
            defaultValue = dateParser.current.formatValue(props.field.value!);
        }
        return (<InputBaseBox ref={inputRef}
                              placeholder={Placeholder[maskNonNull]}
                              defaultValue={defaultValue}
                              readOnly={isReadOnly}
                              onBlur={onBlur}
                              onChange={onChange}  />)
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


