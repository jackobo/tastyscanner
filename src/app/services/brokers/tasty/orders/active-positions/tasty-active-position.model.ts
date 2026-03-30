import {IActivePositionViewModel} from "../../../interfaces/active-position.interfaces";
import {IAppServiceFactory} from "../../../../app-service-factory.interface";
import {
    ITastyOrderConsolidatedWithPositions
} from "../../raw-data/tasty-order-consoliddate-with-positions.raw-data.interface";
import {NullableNumber} from "../../../../../../framework/types/nullable-types";
import {Check} from "../../../../../../framework/utils/type-checking";
import {TastyActivePositionLegModel} from "./tasty-active-position-leg.model";
import {MathUtils} from "../../../../../../framework/utils/math-utils";

export class TastyActivePositionModel implements IActivePositionViewModel {
    constructor(private readonly services: IAppServiceFactory,
                private readonly orderRawData: ITastyOrderConsolidatedWithPositions) {
        this.legs = orderRawData.legs.map(leg => new TastyActivePositionLegModel(services, leg))
                                     .sort((l1, l2) => (l1.strikePrice ?? 0) - (l2.strikePrice ?? 0));
    }

    get id(): string {
        return this.orderRawData.id.toString();
    }
    get underlyingSymbol(): string {
        return this.orderRawData.underlyingSymbol;
    }
    get createdAt(): Date {
        return this.orderRawData.terminalAt;
    }

    private _sumValues(values: number[]): number {
        return MathUtils.round(values.sum(val => val));
    }

    get profitLossPercent(): number {
        return 100 * (this.profitLoss / Math.abs(this.tradingCost));
    }

    get profitLoss(): number {
        return this._sumValues(this.legs.map(leg => leg.profitLoss));
    }

    get marketPrice(): number {
        return this._sumValues(this.legs.map(leg => leg.marketPrice));
    }
    get tradingPrice(): number {
        return this._sumValues(this.legs.map(leg => leg.tradingPrice));
    }

    get tradingCost(): number {
        return this._sumValues(this.legs.map(leg => leg.tradingCost));
    }


    get daysToExpiration(): NullableNumber {
        const daysToExpiration =  this.legs.filter(l => !Check.isNullOrUndefined(l.daysToExpiration))
            .map(l => l.daysToExpiration ?? 0);
        if(daysToExpiration.length === 0) {
            return null;
        }
        return Math.min(...daysToExpiration);
    }



    public readonly legs: TastyActivePositionLegModel[];

    getAllStreamerSymbols(): string[] {
        return this.legs.map(leg => leg.streamerSymbol);
    }
}



