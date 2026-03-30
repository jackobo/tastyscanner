import {TastyActivePositionModel} from "./tasty-active-position.model";
import {
    IUnderlyingActivePositionsViewModel
} from "../../../interfaces/active-position.interfaces";
import {NullableNumber} from "../../../../../../framework/types/nullable-types";
import {MathUtils} from "../../../../../../framework/utils/math-utils";
import {computed, makeObservable} from "mobx";
import {ITickerViewModel} from "../../../../../models/ticker/ticker.view-model.interface";
import {IAppServiceFactory} from "../../../../app-service-factory.interface";

export class TastyUnderlyingActivePositionsModel implements IUnderlyingActivePositionsViewModel {
    constructor(public readonly symbol: string,
                activePositions: TastyActivePositionModel[],
                private readonly services: IAppServiceFactory) {
        this.activePositions = [...activePositions].sort((a, b) => (a.daysToExpiration ?? 0) - (b.daysToExpiration ?? 0));

        makeObservable(this, {
            daysToExpiration: computed,
            tradingCost: computed,
            profitLoss: computed,
            profitLossPercent: computed,
            marketPrice: computed,
            tradingPrice: computed,
            delta: computed,
            theta: computed,
        });
    }

    public readonly activePositions: TastyActivePositionModel[];

    public static fromPositions(activePositions: TastyActivePositionModel[], services: IAppServiceFactory): TastyUnderlyingActivePositionsModel[] {
        const positionsByUnderlying = activePositions.groupByKey(o => o.underlyingSymbol);

        const underlyingSymbols = Object.keys(positionsByUnderlying).sort((s1, s2) => s1.localeCompare(s2));
        return underlyingSymbols.map(key => new TastyUnderlyingActivePositionsModel(key, positionsByUnderlying[key], services));

    }

    private get ticker(): ITickerViewModel {
        return this.services.tickers.getTicker(this.symbol);
    }

    private _sumValues(values: number[]): number {
        return MathUtils.round(values.sum(val => val));
    }

    get daysToExpiration(): NullableNumber {
        if(this.activePositions.length === 0) {
            return null;
        }
        return Math.min(...this.activePositions.map(p => p.daysToExpiration ?? 0));
    }

    get tradingCost(): number {
        return this.activePositions.sum(p => p.tradingCost);
    }

    get profitLoss(): number {
        return this._sumValues(this.activePositions.map(p => p.profitLoss));
    }

    get profitLossPercent(): number {
        return  MathUtils.round(100 * (this.profitLoss / Math.abs(this.tradingCost)));
    }

    get marketPrice(): number {
        return this._sumValues(this.activePositions.map(p => p.marketPrice));
    }
    get tradingPrice(): number {
        return this._sumValues(this.activePositions.map(p => p.tradingPrice));
    }

    get bidPrice(): NullableNumber {
        return this.ticker.quote?.bidPrice ?? null;
    }
    get askPrice(): NullableNumber {
        return this.ticker.quote?.askPrice ?? null;
    }

    get delta(): NullableNumber {
        return  this._sumValues(this.activePositions.map(p => p.delta ?? 0));
    }

    get theta(): NullableNumber {
        return  this._sumValues(this.activePositions.map(p => p.theta ?? 0));
    }


}