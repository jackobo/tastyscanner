import {FormFields, IFormField} from "./form-field.interface";
import {IFieldOptions} from "./form-field-options.interface";
import {IActivateErrorsValidationOptions, IFormModel} from "./form-model.interface";
import {FormFieldModel} from "./form-field.model";
import {computed, makeObservable} from "mobx";
import {Check} from "../../utils/type-checking";
import {IFrameworkServiceFactory} from "../../services/framework-service-factory.interface";



export abstract class FormModel<TFields, TServiceFactory extends IFrameworkServiceFactory> implements IFormModel<TFields> {

    constructor(public readonly services: TServiceFactory) {
        makeObservable<this, '_fieldsList'>(this, {
            _fieldsList: computed
        });
    }

    protected abstract _createFields(): FormFields<TFields>;

    private _fields: FormFields<TFields> | null = null;
    public get fields(): FormFields<TFields> {
        if(!this._fields) {
            this._fields = this._createFields();
            this._onFieldsCreated(this._fields);
            Object.keys(this._fields).forEach(fieldName => {
                const formField = (this._fields as any)[fieldName] as FormFieldModel;
                formField.onChange(() => this._onFieldChanged(formField));
            })
        }
        return this._fields;
    }

    protected _onFieldsCreated(fields: FormFields<TFields>): void {

    }

    async suspendFieldsChangeEvents(): Promise<void> {
        this._fieldsList.forEach(field => field.suspendChangeEvent());
    }

    async resumeFieldsChangeEvents(): Promise<void> {
        this._fieldsList.forEach(field => field.suspendChangeEvent());
    }

    protected _onFieldChanged(field: IFormField): void {
        this._fieldsList.forEach(f => f.refreshValidationError());
    }

    private get _fieldsList(): FormFieldModel[]{
        return Object.keys(this.fields).map(fieldName => (this.fields as any)[fieldName] as FormFieldModel);
    }

    /**
     * returns the list of fields that have validation errors
     */
    activateErrorsValidation(options?: IActivateErrorsValidationOptions): IFormField[] {
        options = {
            setFocusOnFirstError: true,
            ...options
        }
        const fieldsWithErrors: IFormField[] = [];
        this._fieldsList.forEach(f => {
            f.activateErrorsValidation();
            if(f.hasError) {
                fieldsWithErrors.push(f);
            }
        });

        if(options.setFocusOnFirstError) {
            if(fieldsWithErrors.length > 0) {
                fieldsWithErrors[0].setFocus();
            }
        }

        return fieldsWithErrors;
    }

    resetErrorsValidation(): void {
        this._fieldsList.forEach(f => f.resetErrorsValidation())
    }

    hasErrors(): boolean {
        return this._fieldsList.some(f => f.getValidationError());
    }

    getFieldsWithErrors(): IFormField[] {
        return this._fieldsList.filter(f => f.getValidationError());
    }

    hasChanges(): boolean {
        return this._fieldsList.some(f => f.hasChanges);
    }

    clearAllFields(): void {
        this._fieldsList.forEach(f => f.clear());
    }

    isFormReadOnly(): boolean {
        return false;
    }

    protected _createField<TFieldType>(fieldOptions: IFieldOptions<TFieldType>): IFormField<TFieldType> {
        const fieldReadOnly = fieldOptions.isReadOnly;

        fieldOptions.isReadOnly = () => {
            if(this.isFormReadOnly()) {
                return true;
            }

            if(Check.isNullOrUndefined(fieldReadOnly)) {
                return false;
            }

            if(Check.isBoolean(fieldReadOnly)) {
                return fieldReadOnly;
            }

            return fieldReadOnly();
        }

        return new FormFieldModel<TFieldType>(fieldOptions, this.services);
    }

    commitChanges(): void {
        if(this.hasErrors()) {
            throw new Error('There are validation errors');
        }

        this._fieldsList.forEach(f => f.commitChanges());
    }

    cancelChanges(): void {
        this._fieldsList.forEach(f => f.cancelChanges());
    }

    hasChangesOnCurrentSession(): boolean {
        return this._fieldsList.some(f => f.hasChangesOnCurrentSession());
    }
}
