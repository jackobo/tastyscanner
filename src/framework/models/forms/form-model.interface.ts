import {FormFields, IFormField} from "./form-field.interface";

export interface IActivateErrorsValidationOptions {
    setFocusOnFirstError: boolean;
}

export interface IFormModel<TFields> {
    readonly fields: FormFields<TFields>;
    isFormReadOnly(): boolean;
    hasErrors(): boolean;
    hasChanges(): boolean;
    hasChangesOnCurrentSession(): boolean;
    activateErrorsValidation(options?: IActivateErrorsValidationOptions): IFormField[];

    /**
     * Sets all fields on null and reset validation errors
     */
    clearAllFields(): void;
    cancelChanges(): void;
    commitChanges(): void;
}
