import {NullableNumber} from "../../../framework/types/nullable-types";

export interface ITickerMetricsViewModel {
    readonly ivRank: number;
    readonly beta: number;
    readonly earningsDate: string;
    readonly daysUntilEarnings: NullableNumber;
}