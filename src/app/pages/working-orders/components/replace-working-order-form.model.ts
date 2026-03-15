import {IWorkingOrderViewModel} from "../../../services/brokers/interfaces/working-order.interfaces";
import {Check} from "../../../../framework/utils/type-checking";
import {AppFormModel} from "../../../models/forms/app-form.model";
import {IAppServiceFactory} from "../../../services/app-service-factory.interface";
import {IReactionDisposer, reaction} from "mobx";
import {FormFields} from "../../../../framework/models/forms/form-field.interface";
import {NullableNumber} from "../../../../framework/types/nullable-types";

interface IReplaceWorkingOrderFormFields {
    price: string;
    lockPrice: boolean;
}

export class ReplaceWorkingOrderFormModel extends AppFormModel<IReplaceWorkingOrderFormFields>{
    constructor(private readonly workingOrder: IWorkingOrderViewModel, services: IAppServiceFactory) {
        super(services);
        this._midPriceReactionDispose = reaction(() => this.workingOrder.midPrice, (midPrice) => {
            if(!this.fields.lockPrice.value) {
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
                fieldName: () => this.services.language.translate('Trading Price')
            }),
            lockPrice: this._createField<boolean>({
                fieldName: () => this.services.language.translate('Lock price'),
                defaultValue: false
            })
        }
    }

    private _setPriceValue(value: NullableNumber) {
        this.fields.price.setValue(value?.toFixed(2) ?? null);
    }

    protected _onFieldsCreated(fields: FormFields<IReplaceWorkingOrderFormFields>) {
        super._onFieldsCreated(fields);
        this.fields.lockPrice.onChange(newValue => {
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
        newPrice = newPrice + tickSign * tickSize;
        this.fields.price.setValue(newPrice.toFixed(2));
        this.fields.lockPrice.setValue(true);
    }

    incrementPrice(): void {
        this._updatePrice(1);
    }

    decrementPrice(): void {
        this._updatePrice(-1);
    }

}