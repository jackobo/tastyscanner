import {OptionModel} from "./option.model";
import {CreditSpreadModel} from "./credit-spread.model";
import {IAppServiceFactory} from "../services/app-service-factory.interface";
import {OptionsStrategyLegModel} from "./options-strategy-leg.model";

export class PutCreditSpreadModel extends CreditSpreadModel {
    constructor(wingsWidth: number,
                stoPut: OptionModel,
                btoPut: OptionModel,
                services: IAppServiceFactory) {
        super(wingsWidth, stoPut, btoPut, services);
        this.legs = [
            new OptionsStrategyLegModel(btoPut, "BTO"),
            new OptionsStrategyLegModel(stoPut, "STO")
        ];
    }

    get strategyName(): string {
        return "CALL credit spread";
    }

    readonly legs: OptionsStrategyLegModel[];

}