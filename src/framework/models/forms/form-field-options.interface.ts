import {NullableString} from "../../types/nullable-types";
import {IFormField} from "./form-field.interface";
import {IFieldValidator} from "./field-validator.interface";

export interface IFieldOptions<TValue> {
    fieldName: () => string; //The reason for this property being a function is that we want the field name to depend on the language texts observable
    isRequired?: boolean | (() => boolean);
    validate?: (field: IFormField<TValue>) => NullableString;
    /**
     * initialValue is the value that the field will be initialized with and usually is the value that comes from DB
     * This value doesn't make the field dirty, meaning the field hasChanges method will return false.
     */
    initialValue?: () => TValue | null | undefined;

    /**
     * defaultValue is the value that the field will be initialized with but this will make the field dirty
     * meaning calling the field hasChanges method will return true if the field was initialized with a defaultValue
     */
    defaultValue?: TValue | null | undefined;
    maxLength?: number | (() => number);
    validators?: IFieldValidator[],
    isHidden?: () => boolean;
    isReadOnly?: boolean | (() => boolean);
    autoCapitalize?: boolean;
    getValueFromPreviousSession?: () => TValue | null | undefined;
}
