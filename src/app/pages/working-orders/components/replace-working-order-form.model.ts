import {IWorkingOrderViewModel} from "../../../services/brokers/interfaces/working-order.interfaces";
import {Check} from "../../../../framework/utils/type-checking";
import {AppFormModel} from "../../../models/forms/app-form.model";
import {IAppServiceFactory} from "../../../services/app-service-factory.interface";
import {IReactionDisposer, reaction} from "mobx";
import {FormFields} from "../../../../framework/models/forms/form-field.interface";
import {NullableNumber, NullableString} from "../../../../framework/types/nullable-types";

interface IReplaceWorkingOrderFormFields {
    price: string;
    isPriceLocked: boolean;
    resetAutoReplaceAttempts: boolean;
}

export class ReplaceWorkingOrderFormModel extends AppFormModel<IReplaceWorkingOrderFormFields>{
    constructor(private readonly workingOrder: IWorkingOrderViewModel, services: IAppServiceFactory) {
        super(services);
        this._midPriceReactionDispose = reaction(() => this.workingOrder.midPrice, (midPrice) => {
            if(!this.fields.isPriceLocked.value) {
                this._setPriceValue(midPrice);
            }
        }, {
            fireImmediately: true
        })

    }

    private readonly _midPriceReactionDispose: IReactionDisposer;

    dispose(): void {
        this._midPriceReactionDispose();
    }

    protected _createFields(): FormFields<IReplaceWorkingOrderFormFields> {
        return {
            price: this._createField<string>({
                fieldName: () => this.services.language.translate('Trading Price'),
                validate: () => this._validatePrice(),
            }),
            isPriceLocked: this._createField<boolean>({
                fieldName: () => this.services.language.translate('Price locked'),
                defaultValue: false,
                isRequired: false,
            }),
            resetAutoReplaceAttempts: this._createField<boolean>({
                fieldName: () => this.services.language.translate('Reset auto replace attempts'),
                defaultValue: false,
                isRequired: false,
            })
        }
    }

    private _validatePrice(): NullableString {
        if(Check.isNullOrUndefined(this.fields.price.value)) {
            return null;
        }

        const newPrice = parseFloat(this.fields.price.value);
        if(!Check.isNumber(newPrice)) {
            return this.services.language.translate('Not a valid value');
        }

        if(newPrice <= 0) {
            return this.services.language.translate('Price must be greater than zero');
        }

        return null;


    }

    private _setPriceValue(value: NullableNumber) {
        this.fields.price.setValue(value?.toFixed(2) ?? null);
    }

    protected _onFieldsCreated(fields: FormFields<IReplaceWorkingOrderFormFields>) {
        super._onFieldsCreated(fields);
        this.fields.isPriceLocked.onChange(newValue => {
            if(!newValue) {
                this._setPriceValue(this.workingOrder.midPrice);
            }
        })
    }

    private _updatePrice(tickSign: number) {
        const tickSize = this.workingOrder.optionsTickSize;
        if(Check.isNullOrUndefined(tickSize)) {
            return;
        }



        let newPrice = parseFloat(this.fields.price.value ?? '0');
        if(!Check.isNumber(newPrice)) {
            return;
        }
        newPrice = newPrice + tickSign * tickSize;
        this.fields.price.setValue(newPrice.toFixed(2));
        this.fields.isPriceLocked.setValue(true);
    }

    incrementPrice(): void {
        this._updatePrice(1);
    }

    decrementPrice(): void {
        this._updatePrice(-1);
    }

    togglePriceLock(): void {
        this.fields.isPriceLocked.setValue(!this.fields.isPriceLocked.value);
    }

    async sendOrder(): Promise<void> {
        if(this.activateErrorsValidation().length > 0) {
            return;
        }
        
        const newPrice = parseFloat(this.fields.price.value ?? '0');
        await this.workingOrder.replace(newPrice, {
            resetAutoReplaceAttempts: this.fields.resetAutoReplaceAttempts.value ?? false
        });
    }
}