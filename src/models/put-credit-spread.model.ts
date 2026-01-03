import {OptionModel} from "./option.model";
import {CreditSpreadModel} from "./credit-spread.model";

export class PutCreditSpreadModel extends CreditSpreadModel {
    constructor(wingsWidth: number,
                stoPut: OptionModel,
                btoPut: OptionModel) {
        super(wingsWidth, stoPut, btoPut);
    }


}