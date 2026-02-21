import {NullableString} from "../../types/nullable-types";

export type FormFields<TFields> = {
    [Property in keyof TFields]: IFormField<TFields[Property]>
}


export interface IFormFieldOnChangeSubscription {
    unsubscribe(): void;
}

export interface IFormFieldSetFocusOptions {
    noScroll?: boolean;
}

export interface IFormField<TValue = any> {
    readonly fieldName: string;
    readonly value: TValue | null;
    setValue(value: TValue | null): void;
    readonly activatedError: NullableString;
    getValidationError(): NullableString
    readonly hasError: boolean;
    setCustomError(error: NullableString): void;
    activateErrorsValidation(): void;
    readonly maxLength?: number;
    readonly isHidden: boolean;
    readonly isReadOnly: boolean;
    readonly autoCapitalize: boolean;
    refreshValidationError(): void;
    suspendChangeEvent(): void;
    resumeChangeEvent(): void;
    onChange(callback: (newValue: TValue | null) => void): IFormFieldOnChangeSubscription;

    /**
     * set current value on null and resets error validation
     */
    clear(): void;

    /**
     * Attach to this field the DOM element that represents the actual input (e.g. input, check, select etc.)
     * This will be the element that will be focused when the field has errors
     * @param element
     */
    attachInputDOMElement(element: any): void;

    /**
     * Attach to this field the element that contains all the visual UI elements for this field (container of the label and the input)
     * Usually this is the FieldValidatorComponent root element
     * @param element
     */
    attachContainerDOMElement(element: any): void;
    readonly hasElementAttached: boolean;
    setFocus(options?: IFormFieldSetFocusOptions): void;
}
