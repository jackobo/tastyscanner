import {IWorkingOrderViewModel} from "../../../services/brokers/interfaces/working-order.interfaces";
import {Check} from "../../../../framework/utils/type-checking";
import {AppFormModel} from "../../../models/forms/app-form.model";
import {IAppServiceFactory} from "../../../services/app-service-factory.interface";
import {IReactionDisposer, reaction} from "mobx";
import {FormFields} from "../../../../framework/models/forms/form-field.interface";
import {NullableNumber, NullableString} from "../../../../framework/types/nullable-types";
import {NullablePrice, Price} from "../../../models/price/price";

interface IReplaceWorkingOrderFormFields {
    price: Price;
    isPriceLocked: boolean;
    resetAutoReplaceAttempts: boolean;
}

export class ReplaceWorkingOrderFormModel extends AppFormModel<IReplaceWorkingOrderFormFields>{
    constructor(private readonly workingOrder: IWorkingOrderViewModel,
                private readonly initialPriceValue: Price,
                private readonly isPriceInitiallyLocked: boolean,
                services: IAppServiceFactory) {
        super(services);
    }

    private _midPriceReactionDispose: IReactionDisposer | null = null;

    dispose(): void {
        if(this._midPriceReactionDispose) {
            this._midPriceReactionDispose();
        }

    }

    protected _createFields(): FormFields<IReplaceWorkingOrderFormFields> {
        return {
            price: this._createField<Price>({
                fieldName: () => this.services.language.translate('Price') + ` (${this.workingOrder.tradingPrice.priceEffect})`,
                defaultValue: this.initialPriceValue,
                validate: () => this._validatePrice(),
            }),
            isPriceLocked: this._createField<boolean>({
                fieldName: () => this.services.language.translate('Price locked'),
                defaultValue: this.isPriceInitiallyLocked,
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


        if(this.fields.price.value.value <= 0) {
            return this.services.language.translate('Price must be greater than zero');
        }

        return null;


    }

    private _setPriceValue(value: NullablePrice) {
        this.fields.price.setValue(value);
    }

    protected _onFieldsCreated(fields: FormFields<IReplaceWorkingOrderFormFields>) {
        super._onFieldsCreated(fields);
        this.fields.isPriceLocked.onChange(newValue => {
            if(!newValue) {
                this._setPriceValue(this.workingOrder.midPrice);
            }
        })


        this._midPriceReactionDispose = reaction(() => this.workingOrder.midPrice, (midPrice) => {
            if(!this.fields.isPriceLocked.value) {
                if(Check.isNullOrUndefined(midPrice)) {
                    this._setPriceValue(this.workingOrder.tradingPrice);
                } else {
                    this._setPriceValue(midPrice);
                }
            }
        })

    }

    get tickSize(): NullableNumber {
        return this.workingOrder.optionsTickSize;
    }

    private _updatePrice(tickSign: number) {
        const tickSize = this.tickSize;
        if(Check.isNullOrUndefined(tickSize)) {
            return;
        }

        if(Check.isNullOrUndefined(this.fields.price.value)) {
            return;
        }

        const newPrice = this.fields.price.value.addValue(tickSign * tickSize);
        this.fields.price.setValue(newPrice);
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

        if(!this.fields.price.value) {
            await this.services.alert.showErrorAsync(this.services.language.translate('Must enter the price'))
            return;
        }

        await this.workingOrder.replace(this.fields.price.value, {
            resetAutoReplaceAttempts: this.fields.resetAutoReplaceAttempts.value ?? false
        });
    }
}