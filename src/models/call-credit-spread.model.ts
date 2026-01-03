import {OptionModel} from "./option.model";
import {CreditSpreadModel} from "./credit-spread.model";

export class CallCreditSpreadModel extends CreditSpreadModel {
    constructor(wingsWidth: number,
                stoCall: OptionModel,
                btoCall: OptionModel) {
        super(wingsWidth, stoCall, btoCall);
    }


}