import {OptionModel} from "./option.model";
import {CreditSpreadModel} from "./credit-spread.model";
import {IServiceFactory} from "../services/service-factory.interface";
import {OptionsStrategyLegModel} from "./options-strategy-leg.model";

export class PutCreditSpreadModel extends CreditSpreadModel {
    constructor(wingsWidth: number,
                stoPut: OptionModel,
                btoPut: OptionModel,
                services: IServiceFactory) {
        super(wingsWidth, stoPut, btoPut, services);
    }

    get strategyName(): string {
        return "CALL credit spread";
    }

    get legs(): OptionsStrategyLegModel[] {
        return [
            new OptionsStrategyLegModel(this.btoOption, "BTO"),
            new OptionsStrategyLegModel(this.stoOption, "STO")
        ];
    }
}