import {IOptionViewModel} from "./option.view-model.interface";
import {IOptionsStrategyLegViewModel} from "./options-strategy-leg.view-model.interface";
import {OrderSimpleLegActionType} from "../services/brokers/interfaces/open-order-request.interface";

export class OptionsStrategyLegModel implements IOptionsStrategyLegViewModel {
    constructor(public readonly option: IOptionViewModel,
                public readonly legActionType: OrderSimpleLegActionType) {
    }

    get key(): string {
        return `${this.option.strikePrice}_${this.option.optionType}_${this.legActionType}`;
    }

    get isSell(): boolean {
        return this.legActionType === 'STO';
    }

    get isBuy(): boolean {
        return this.legActionType === 'BTO';
    }

    get countExistingSameDirectionPositions(): number {
        return this.isSell ? this.option.countSells : this.option.countBuys;
    }

    get hasOppositePositions(): boolean {
        if(this.isSell) {
            return this.option.countBuys != 0;
        } else {
            return this.option.countSells != 0;
        }
    }
}