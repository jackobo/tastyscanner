
export interface IStrategySettingsService {
    readonly strategyFilters: IStrategyFiltersViewModel;
}


export type ByEarningsDate = 'before' | 'after' | 'all';
export type ByExistingPositions = 'include' | 'exclude';

export interface IStrategyFiltersViewModel {
    minDelta: number;
    maxDelta: number;
    condorsMinDelta: number;
    condorsMaxDelta: number;
    maxRiskRewardRatio: number;
    minPop: number;
    minDaysToExpiration: number;
    maxDaysToExpiration: number;
    maxBidAskSpread: number;
    wings: number[];
    readonly availableWings: number[];
    byEarningsDate: ByEarningsDate;
    byExistingPositions: ByExistingPositions;
    readonly lastUpdate: number;
}

