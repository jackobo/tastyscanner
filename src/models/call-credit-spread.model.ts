import {OptionModel} from "./option.model";
import {CreditSpreadModel} from "./credit-spread.model";
import {IServiceFactory} from "../services/service-factory.interface";

export class CallCreditSpreadModel extends CreditSpreadModel {
    constructor(wingsWidth: number,
                stoCall: OptionModel,
                btoCall: OptionModel,
                services: IServiceFactory) {
        super(wingsWidth, stoCall, btoCall, services);
    }


}