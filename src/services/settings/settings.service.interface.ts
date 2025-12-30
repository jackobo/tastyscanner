
export interface ISettingsService {
    readonly ironCondorScanner: IronCondorScannerSettingsViewModel;
}

export interface IronCondorScannerSettingsViewModel {
    minDelta: number;
    maxDelta: number;
    maxRiskRewardRatio: number;
    minDaysToExpiration: number;
    maxDaysToExpiration: number;
    maxBidAskSpread: number;
    wings: number[];
    readonly availableWings: number[];
}

