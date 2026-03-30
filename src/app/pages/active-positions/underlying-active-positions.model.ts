import {IActivePositionViewModel} from "../../services/brokers/interfaces/active-position.interfaces";

export class UnderlyingActivePositionsModel {
    constructor(public readonly symbol: string, activePositions: IActivePositionViewModel[]) {
        this.activePositions = activePositions.sort((a, b) => (a.daysToExpiration ?? 0) - (b.daysToExpiration ?? 0));
    }

    public readonly activePositions: IActivePositionViewModel[];

    public static fromPositions(activePositions: IActivePositionViewModel[]) {
        const ordersByUnderlying = activePositions.groupByKey(o => o.underlyingSymbol);

        const underlyingSymbols = Object.keys(ordersByUnderlying).sort((s1, s2) => s1.localeCompare(s2));
        return underlyingSymbols.map(key => new UnderlyingActivePositionsModel(key, ordersByUnderlying[key]));

    }

}