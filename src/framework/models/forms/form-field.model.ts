import {IFormField, IFormFieldOnChangeSubscription, IFormFieldSetFocusOptions} from "./form-field.interface";
import {IFieldOptions} from "./form-field-options.interface";
import {action, makeObservable, observable, runInAction} from "mobx";
import {NullableString, UndefinedNumber} from "../../types/nullable-types";
import {IFieldValidator} from "./field-validator.interface";
import {setElementFocus} from "../../utils/set-element-focus";
import {scrollElementIntoViewSmooth} from "../../utils/scroll-element-into-view";
import {Check} from "../../utils/type-checking";
import {IFrameworkServiceFactory} from "../../services/framework-service-factory.interface";

export class FormFieldModel<TValue = any> implements IFormField<TValue>{

    readonly _options: IFieldOptions<TValue>;


    constructor(options: IFieldOptions<TValue>,
                private services: IFrameworkServiceFactory) {

        this._options = {
            isRequired: true,
            ...options
        }

        this._setInitialValue();

        makeObservable<this, '_uncommittedValue' | '_committedValue' | '_setInitialValue' | '_setUncommittedValue' | '_customError'>(this, {
            _uncommittedValue: observable.ref,
            _committedValue: observable.ref,
            activatedError: observable.ref,
            setValue: action.bound,
            activateErrorsValidation: action.bound,
            _setInitialValue: action.bound,
            _setUncommittedValue: action.bound,
            cancelChanges: action.bound,
            commitChanges: action.bound,
            resetErrorsValidation: action.bound,
            _customError: observable.ref,
            clear: action.bound
        });
    }



    private get valueOnPreviousSession(): TValue | null {
        if(this._options.getValueFromPreviousSession) {
            return this._options.getValueFromPreviousSession() ?? null;
        }

        return null;
    }


    get fieldName(): string {
        return this._options.fieldName();
    }

    private _isEmptyValue(value: TValue | null | undefined | string): value is null | undefined | '' {
        if(Check.isNullOrUndefined(value)) {
            return true;
        }

        if(Check.isString(value)) {
            return value === '';
        }

        return false;
    }

    private _setInitialValue(): void {


        const initialValue = this._options.initialValue && this._options.initialValue();

        if(this._isEmptyValue(initialValue)) {
            if(!this._isEmptyValue(this._options?.defaultValue)) {
                this._setUncommittedValue(this._options.defaultValue);
            }
        } else {
            this._committedValue = initialValue;
            this._uncommittedValue = initialValue;
        }
    }

    clear(): void {
        this.setValue(null);
        this.commitChanges();
    }

    private _committedValue: TValue | null = null;
    private _uncommittedValue: TValue | null = null;

    get autoCapitalize(): boolean {
        return Boolean(this._options.autoCapitalize);
    }
    get value(): TValue | null {
        return this._uncommittedValue;
    }

    private _setUncommittedValue(value: TValue | null): void {
        this._uncommittedValue = value;
    }

    private _suspendChangeEvent = false;
    suspendChangeEvent(): void {
        this._suspendChangeEvent = true;
    }

    resumeChangeEvent() {
        this._suspendChangeEvent = false;
    }

    setValue(value: TValue | null): void {
        const isRealChange = !this._valuesAreEqual(value, this.value);
        this._setUncommittedValue(value);

        this.refreshValidationError();

        if(isRealChange) {
            this._triggerOnChange(value);
        }

    }

    private _triggerOnChange(value: TValue | null) {
        if(this._suspendChangeEvent) {
            return;
        }
        this._onChangeCallbacks.forEach(callback => {
            try {
                callback(value);
            } catch (err) {
                this.services.logger.error(`On change callback for form field ${this._options.fieldName} failed`, err);
            }
        });
    }

    get hasChanges(): boolean {
        return !this._valuesAreEqual(this._uncommittedValue, this._committedValue);
    }

    hasChangesOnCurrentSession(): boolean {
        return !this._valuesAreEqual(this.valueOnPreviousSession, this._committedValue ?? null);
    }

    private _valuesAreEqual(value1: TValue | null | undefined, value2: TValue | null | undefined) {
        if(Check.isDate(value1) && Check.isDate(value2)) {
            return value1.getTime() === value2.getTime();
        }

        return value1 === value2;
    }

    get maxLength(): UndefinedNumber {
        if(Check.isNullOrUndefined(this._options.maxLength)) {
            return undefined;
        }

        if(Check.isNumber(this._options.maxLength)) {
            return this._options.maxLength;
        }

        return this._options.maxLength();
    }

    private _isRequired() {
        if(Check.isNullOrUndefined(this._options.isRequired)) {
            return true;
        }
        if(Check.isBoolean(this._options.isRequired)) {
            return this._options.isRequired;
        } else {
            return this._options.isRequired();
        }
    }

    get isHidden(): boolean {
        if(this._options.isHidden) {
            return this._options.isHidden();
        }
        return false;
    }

    get isReadOnly(): boolean {
        if(Check.isNullOrUndefined(this._options.isReadOnly)) {
            return false;
        }
        if(Check.isBoolean(this._options.isReadOnly)) {
            return this._options.isReadOnly;
        }
        return this._options.isReadOnly();
    }

    activatedError: NullableString = null;

    private _customError: NullableString = null;

    setCustomError(error: NullableString): void {
        runInAction(() => {
            this._customError = error;
            this.refreshValidationError();
        });
    }

    get hasError(): boolean {
        if(this.isHidden) {
            return false;
        }
        return !Check.isNullOrUndefined(this.activatedError);
    }

    _errorsValidationIsActive = false;
    activateErrorsValidation() {
        this._errorsValidationIsActive = true;
        this.refreshValidationError();
    }

    resetErrorsValidation(): void {
        this._errorsValidationIsActive = false;
        this.activatedError = null;
    }

    refreshValidationError(): void {
        if(this._errorsValidationIsActive) {
            this.activatedError = this.getValidationError();
        }
    }

    private getValidators(): IFieldValidator[] {
        return this._options.validators || [];
    }

    getValidationError(): NullableString {
        if(this.isHidden) {
            return null;
        }

        if(this._customError) {
            return this._customError;
        }

        if(this._isRequired() && Check.isEmpty(this.value)) {
            return this.services.language.translate('Required field') || null;
        }

        if(this._options.validate) {
            const validationError = this._options.validate(this);
            if(validationError) {
                return validationError;
            }
        }

        for(const validator of this.getValidators()) {
            const validationError = validator.validate(this.value);
            if(validationError) {
                return validationError;
            }
        }

        return null;
    }

    private _onChangeCallbacks: Array<(newValue: TValue | null) => void> = [];

    onChange(callback: (newValue: TValue | null) => void): IFormFieldOnChangeSubscription {
        this._onChangeCallbacks.push(callback);

        return {
            unsubscribe: () => {
                const index = this._onChangeCallbacks.findIndex(cbk => cbk === callback);
                if(index >= 0) {
                    this._onChangeCallbacks.splice(index, 1);
                }
            }
        }
    }

    commitChanges(): void {
        this._committedValue = this._uncommittedValue;
        this.activatedError = null;
        this._errorsValidationIsActive = false;
    }

    cancelChanges(): void {
        const isThereAnythingToCancel = !this._valuesAreEqual(this._uncommittedValue, this._committedValue);
        this._uncommittedValue = this._committedValue;
        this.activatedError = null;
        this._errorsValidationIsActive = false;
        if(isThereAnythingToCancel) {
            this._triggerOnChange(this._committedValue);
        }
    }

    private _inputElementRef: any = null;
    attachInputDOMElement = (element: any) => {
        this._inputElementRef = element;
    }

    private _containerElementRef: any = null;
    attachContainerDOMElement = (element: any) => {
        this._containerElementRef = element;
    }

    get hasElementAttached(): boolean {
        return Boolean(this._inputElementRef);
    }

    setFocus(options?: IFormFieldSetFocusOptions): void {
        if(!options?.noScroll) {
            scrollElementIntoViewSmooth(this._containerElementRef);
        }

        setElementFocus(this._inputElementRef);
    }
}
