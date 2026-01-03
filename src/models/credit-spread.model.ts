import {ICreditSpreadViewModel} from "./credit-spread.view-model.interface";
import {OptionModel} from "./option.model";

export abstract class CreditSpreadModel implements ICreditSpreadViewModel {
    constructor(public readonly wingsWidth: number,
                public readonly stoOption: OptionModel,
                public readonly btoOption: OptionModel) {
    }

    get key(): string {
        return `${this.wingsWidth}${this.stoOption.strikePrice}${this.btoOption.strikePrice}`;
    }

    get credit(): number {
        const val = this.stoOption.lastPrice - this.btoOption.lastPrice;
        return Math.round(val * 100) / 100;
    }

    get riskRewardRatio(): number {
        const rr = this.wingsWidth / this.credit;
        return Math.round(rr * 100) / 100;
    }

    get pop(): number {
        return 100 - this.stoOption.delta;

    }
}
