import {OptionModel} from "./option.model";
import {CreditSpreadModel} from "./credit-spread.model";
import {IAppServiceFactory} from "../services/app-service-factory.interface";
import {OptionsStrategyLegModel} from "./options-strategy-leg.model";

export class CallCreditSpreadModel extends CreditSpreadModel {
    constructor(wingsWidth: number,
                stoCall: OptionModel,
                btoCall: OptionModel,
                services: IAppServiceFactory) {
        super(wingsWidth, stoCall, btoCall, services);
        this.legs = [
            new OptionsStrategyLegModel(stoCall, "STO"),
            new OptionsStrategyLegModel(btoCall, "BTO")
        ];
    }

    get strategyName(): string {
        return "CALL credit spread";
    }

   readonly legs: OptionsStrategyLegModel[];




}