import {TastyActivePositionModel} from "./tasty-active-position.model";
import {
    IUnderlyingActivePositionsViewModel
} from "../../../interfaces/active-position.interfaces";
import {NullableNumber} from "../../../../../../framework/types/nullable-types";
import {MathUtils} from "../../../../../../framework/utils/math-utils";

export class TastyUnderlyingActivePositionsModel implements IUnderlyingActivePositionsViewModel {
    constructor(public readonly symbol: string, activePositions: TastyActivePositionModel[]) {
        this.activePositions = [...activePositions].sort((a, b) => (a.daysToExpiration ?? 0) - (b.daysToExpiration ?? 0));
    }

    public readonly activePositions: TastyActivePositionModel[];

    public static fromPositions(activePositions: TastyActivePositionModel[]): TastyUnderlyingActivePositionsModel[] {
        const positionsByUnderlying = activePositions.groupByKey(o => o.underlyingSymbol);

        const underlyingSymbols = Object.keys(positionsByUnderlying).sort((s1, s2) => s1.localeCompare(s2));
        return underlyingSymbols.map(key => new TastyUnderlyingActivePositionsModel(key, positionsByUnderlying[key]));

    }

    get daysToExpiration(): NullableNumber {
        if(this.activePositions.length === 0) {
            return null;
        }
        return Math.min(...this.activePositions.map(p => p.daysToExpiration ?? 0));
    }
    readonly profitLossPercent: number = 0;
    readonly profitLoss: number = 0;
    get delta(): NullableNumber {
        return  MathUtils.round(this.activePositions.sum(p => p.delta ?? 0));
    }

    get theta(): NullableNumber {
        return  MathUtils.round(this.activePositions.sum(p => p.theta ?? 0));
    }


}