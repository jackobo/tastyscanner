
export interface ISettingsService {
    readonly strategyFilters: IStrategyFiltersViewModel;
}

export type PriceType = 'mid' | 'last';

export interface IStrategyFiltersViewModel {
    minDelta: number;
    maxDelta: number;
    maxRiskRewardRatio: number;
    minDaysToExpiration: number;
    maxDaysToExpiration: number;
    maxBidAskSpread: number;
    wings: number[];
    priceToUse: PriceType;
    readonly availableWings: number[];
}

