
export interface ISettingsService {
    readonly ironCondorFilters: IronCondorFiltersViewModel;
}

export interface IronCondorFiltersViewModel {
    minDelta: number;
    maxDelta: number;
    maxRiskRewardRatio: number;
    minDaysToExpiration: number;
    maxDaysToExpiration: number;
    maxBidAskSpread: number;
    wings: number[];
    readonly availableWings: number[];
}

