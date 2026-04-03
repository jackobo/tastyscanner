
export interface IStrategySettingsService {
    readonly strategyFilters: IStrategyFiltersViewModel;
}


export type ByEarningsDate = 'before' | 'after' | 'all';
export type ByExistingPositions = 'include' | 'exclude';
export enum BestStrategyEnum {
    BestRiskReward = 1,
    BestPOP = 2
}



export interface IStrategyFiltersViewModel {
    readonly availableWings: number[];
    readonly lastUpdate: number;
    bestStrategy: BestStrategyEnum[];
    minDelta: number;
    maxDelta: number;
    condorsMinDelta: number;
    condorsMaxDelta: number;
    maxRiskRewardRatio: number;
    condorsMinCallPremiumVsPutPremiumPercentage: number;
    condorsMaxCallPremiumVsPutPremiumPercentage: number;
    minPop: number;
    minDaysToExpiration: number;
    maxDaysToExpiration: number;
    maxBidAskSpread: number;
    wings: number[];
    byEarningsDate: ByEarningsDate;
    byExistingPositions: ByExistingPositions;


}

